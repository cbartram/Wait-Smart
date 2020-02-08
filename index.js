require('dotenv').config();
const moment = require('moment');
const Api = require('lambda-api-router');
const AWS = require('aws-sdk');
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

app.get('/', async (req, res) => {
    try {
        const access_token = await getUniversalAccessToken();
        const poi = await getPointsOfInterest(access_token);

        const cachePromises = [];
        const promises = [];
        poi.Rides.forEach(ride => {
            console.log('[INFO] Checking Cache for ride: ', ride.Id);
            cachePromises.push(cache.getAsync(ride.Id));
        });
        const cachedItems = await Promise.all(cachePromises);
        cachedItems.forEach((ride, idx) => {
            const realRide = poi.Rides[idx];
            delete realRide.WaitTime;
           if(!ride) {
               console.log('[INFO] Inserting Ride into cache: ', realRide);
               cache.set(realRide.Id, JSON.stringify(realRide));
           } else {
               console.log('[INFO] Found cached ride: ', realRide.Id);
           }
        });
        res.json(poi);
    } catch(err) {
        console.log('[ERROR] Failed to retrieve data from Universal API: ', err);
        res.status(500).json({ message: 'Failed to retrieve data from Universal API', error: err });
    }
});

app.get('/rides/:id', async (req, res) => {
    // TODO check ride id against regex for a number
    console.log(`[INFO] Finding data for ride: ${req.params.id}`);
    try {
        const { Items } = await ddb.query({
            TableName: DYNAMODB_TABLE_NAME,
            KeyConditionExpression: 'pid = :pid AND sid BETWEEN :before AND :now',
            ExpressionAttributeValues: {
                ':pid': `RIDE-${req.params.id}`,
                ':before': moment().subtract(2, 'hours').valueOf(),
                ':now': moment().valueOf()
            }
        }).promise();

        // Find additional ride meta-data from cache
        const rideMetaData = await cache.getAsync(req.params.Id);
        console.log('[INFO] Ride Meta-Data: ', rideMetaData);
        if(rideMetaData) {
            res.json({...rideMetaData, waitTimes: Items});
        } else {
            // TODO lookup the ride meta-data?
            console.log('[INFO] Cache did not contain meta-data for ride: ', req.params.Id);
            res.json(Items);
        }
    } catch(err) {
        console.log('[ERROR] Failed to query for ride wait times within given range.', err);
        res.status(500).json({ message: 'Failed to query for ride wait times within the given range.', error: err });
    }

});


exports.handler = async (event, context) => app.listen(event, context);