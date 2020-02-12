require('dotenv').config();
const moment = require('moment');
const Api = require('lambda-api-router');
const AWS = require('aws-sdk');
const _ = require('lodash');
const {
    getUniversalAccessToken,
    getPointsOfInterest
} = require('./src/utils');
const cache = require('./src/redis');
const { DYNAMODB_TABLE_NAME } = process.env;

AWS.config.update({
   region: 'us-east-1'
});
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const app = new Api();

app.cors();

/**
 * Finds all points of interest for the Universal API including: nighlife, restrooms,
 * rides, restaurants etc...
 */
app.get('/', async (req, res) => {
    try {
        const access_token = await getUniversalAccessToken();
        const poi = await getPointsOfInterest(access_token);
        res.json(poi);
    } catch(err) {
        console.log('[ERROR] Failed to retrieve point of interest data from Universal API: ', err);
        res.status(500).json({ message: 'Failed to retrieve point of interest data from Universal API', error: err });
    }
});

/**
 * Finds all rides for a specific park and aggregates the real
 * time average of the wait times for the park as a whole.
 */
app.get('/rides/park/:parkId', async (req, res) => {
    // TODO Validate park id
    console.log('[INFO] Finding all rides for park Id: ', req.params.parkId);
    // console.log('[INFO] Before: ', moment().startOf('day').valueOf());
    // console.log('[INFO] Now: ', moment().valueOf());
    // TODO add pagination here
    const { Items } = await ddb.query({
        TableName: DYNAMODB_TABLE_NAME,
        KeyConditionExpression: 'pid = :pid AND sid BETWEEN :before AND :now',
        ExpressionAttributeValues: {
            ':pid': `PARK-${req.params.parkId}`,
            ':before': moment().startOf('day').valueOf(),
            ':now': moment().valueOf()
        }
    }).promise();

    console.log('[INFO] Found Items: ', Items);

    res.json({ park: Items, id: req.params.parkId, statusCode: 200 });
});

/**
 * Finds all rides from the Universal, IOA, and Volcano bay theme parks. This includes
 * the latest ride time for each ride. (Its not cached and will be pulled from the Universal API each time)
 */
app.get('/rides', async (req, res) => {
    console.log('[INFO] Finding data for all rides...');
    try {
        const access_token = await getUniversalAccessToken();
        const poi = await getPointsOfInterest(access_token);
        res.json({ statusCode: 200, rides: poi.Rides });
    } catch(err) {
        console.log('[ERROR] Failed to retrieve ride data from Universal API: ', err);
        res.status(500).json({ message: 'Failed to retrieve ride data from Universal API', error: err });
    }
});

/**
 * Finds meta-data about a specific ride given the unique ride Id
 * The meta-data is pulled from the cache so tha latest ride wait time is no always accurate.
 * The last 10 minutes of ride wait times are also pulled from the database.
 */
app.get('/rides/:id', async (req, res) => {
    // TODO check ride id against regex for a number
    console.log(`[INFO] Finding data for ride: ${req.params.id}`);
    try {
        const { Items } = await ddb.query({
            TableName: DYNAMODB_TABLE_NAME,
            KeyConditionExpression: 'pid = :pid AND sid BETWEEN :before AND :now',
            ExpressionAttributeValues: {
                ':pid': `RIDE-${req.params.id}`,
                ':before': moment().subtract(10, 'minutes').valueOf(),
                ':now': moment().valueOf()
            }
        }).promise();

        // Find additional ride meta-data from cache
        const rideMetaData = JSON.parse(await cache.getAsync(req.params.id));
        if(rideMetaData) {
            res.json({...rideMetaData, waitTimes: Items.map(({ pid, sid, id, wait}) => ({ timestamp: sid, id, waitTime: wait }) )});
        } else {
            console.log('[INFO] Cache did not contain meta-data for ride: ', req.params.Id);
            res.json(Items);
        }
    } catch(err) {
        console.log('[ERROR] Failed to query for ride wait times within given range.', err);
        res.status(500).json({ message: 'Failed to query for ride wait times within the given range.', error: err });
    }
});


exports.handler = async (event, context) => app.listen(event, context);