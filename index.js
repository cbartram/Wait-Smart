require('dotenv').config();
const moment = require('moment');
const Api = require('lambda-api-router');
const AWS = require('aws-sdk');
const _ = require('lodash');
const {
    getUniversalAccessToken,
    getPointsOfInterest,
    isValidParkId,
} = require('./src/utils');
const poiData = require('./data/pointsOfInterest.json');
const {
    NO_CACHE,
    NODE_ENV,
    DYNAMODB_TABLE_NAME
} = process.env;
const cache = NO_CACHE == null ? require('./src/redis') : null;

AWS.config.update({ region: 'us-east-1' });
const ddb = new AWS.DynamoDB.DocumentClient();
const app = new Api();

app.cors();

/**
 * Finds all points of interest for the Universal API including: nighlife, restrooms,
 * rides, restaurants etc...
 */
app.get('/', async (req, res) => {
    try {
        console.log('[INFO] Finding All POI Data...');
        const access_token = await getUniversalAccessToken();
        const poi = await getPointsOfInterest(access_token);
        res.json(poi);
    } catch(err) {
        NODE_ENV !== "test" && console.log('[ERROR] Failed to retrieve point of interest data from Universal API: ', err);
        res.status(500).json({
            message: 'Failed to retrieve point of interest data from Universal API',
            poi: poiData,
            error: err
        });
    }
});

/**
 * Groups rides into their respective parks.
 */
app.get('/rides/park', async (req, res) => {
    console.log('[INFO] Mapping rides to parks...');
    try {
        const access_token = await getUniversalAccessToken();
        const poi = await getPointsOfInterest(access_token);
        console.log('[INFO] Successfully fetched points of interest and access token. Token =', access_token);
        res.status(200).json({
            parks: _.groupBy(poi.Rides, 'LandId')
        });
    } catch(err) {
        NODE_ENV !== "test" && console.log('[ERROR] Failed to retrieve ride data from Universal API: ', err);
        res.status(500).json({
            message: 'Failed to retrieve ride data from Universal API',
            parks: _.groupBy(poiData.Rides, 'LandId'),
            error: err
        });
    }
})

/**
 * Finds all rides for a specific park and aggregates the real
 * time average of the wait times for the park as a whole.
 */
app.get('/rides/park/:parkId', async (req, res) => {
    if(!isValidParkId(req.params.parkId)) {
        console.log('[WARN] Regular expression: \\d{4,6} does not match given parameter: ', req.params.parkId);
        res.status(400).json({
            error: new Error('The park id must be an integer between 4 and 6 digits long.'),
            message: 'The park id must be an integer between 4 and 6 digits long.'
        });
        return;
    }
    console.log('[INFO] Finding all rides for park Id: ', req.params.parkId);
    try {
        const {Items} = await ddb.query({
            TableName: DYNAMODB_TABLE_NAME,
            KeyConditionExpression: 'pid = :pid AND sid BETWEEN :before AND :now',
            ExpressionAttributeValues: {
                ':pid': `PARK-${req.params.parkId}`,
                ':before': moment().startOf('day').valueOf(),
                ':now': moment().valueOf()
            }
        }).promise();
        res.status(200).json({
            park: Items,
            id: req.params.parkId
        });
    } catch(err) {
        NODE_ENV !== "test" && console.log('[ERROR] Failed to retrieve ride data from DynamoDb: ', err);
        res.status(500).json({
            message: 'Failed to retrieve ride data from Database',
            error: err
        });
    }
});

/**
 * Finds all rides from the Universal, IOA, and Volcano bay theme parks. This includes
 * the latest ride time for each ride. (Its not cached and will be pulled from the Universal API each time)
 */
app.get('/rides', async (req, res) => {
    console.log('[INFO] Finding data for all rides...');
    try {
        console.log('[INFO] Fetching Universal OAuth access_token');
        const access_token = await getUniversalAccessToken();
        console.log(`[INFO] Access token fetched successfully: ${access_token}. Finding points of interest...`);
        const poi = await getPointsOfInterest(access_token);
        res.status(200).json({ rides: poi.Rides });
    } catch(err) {
        NODE_ENV !== "test" && console.log('[ERROR] Failed to retrieve ride data from Universal API: ', err);
        res.status(500).json({
            rides: poiData.Rides,
            message: 'Failed to retrieve ride data from Universal API. Data may be stale and out of date.',
            error: err
        });
    }
});

/**
 * Finds meta-data about a specific ride given the unique ride Id
 * The meta-data is pulled from the cache so tha latest ride wait time is no always accurate.
 * The last 10 minutes of ride wait times are also pulled from the database.
 */
app.get('/rides/:id', async (req, res) => {
    console.log(`[INFO] Finding data for ride: ${req.params.id}`);
    if(!isValidParkId(req.params.id)) {
        console.log('[WARN] Regular expression: \\d{4,6} does not match given parameter: ', req.params.id);
        res.status(400).json({
            error: new Error('The ride id must be an integer between 4 and 6 digits long.'),
            message: 'The ride id must be an integer between 4 and 6 digits long.'
        });
        return;
    }
    try {
        console.log('[INFO] Finding ride in database with id: ', req.params.id)
        const { Items } = await ddb.query({
            TableName: DYNAMODB_TABLE_NAME,
            KeyConditionExpression: 'pid = :pid AND sid BETWEEN :before AND :now',
            ExpressionAttributeValues: {
                ':pid': `RIDE-${req.params.id}`,
                ':before': moment().startOf('day').valueOf(),
                ':now': moment().valueOf()
            }
        }).promise();

        // Find additional ride meta-data
        if(cache == null)  {
            console.log('[INFO] Cache is disabled. Finding ride meta-data via local json file for ride id: ', req.params.id);
            const rideMetadata = _.find(poiData.Rides, ride => ride.Id === +req.params.id);
            console.log('[INFO] Located ride metadata: ', rideMetadata)
            res.status(200).json({ waitTimes: Items, ...rideMetadata });
        } else {
            const rideMetadata = JSON.parse(await cache.getAsync(req.params.id));
            res.status(200).json({...rideMetadata, waitTimes: Items});
        }
    } catch(err) {
        NODE_ENV !== "test" && console.log('[ERROR] Failed to query for ride wait times within given range.', err);
        res.status(500).json({ message: 'Failed to query for ride wait times within the given range.', error: err });
    }
});

exports.handler = async (event, context) => app.listen(event, context);