require('dotenv').config();
const moment = require('moment');
const Api = require('lambda-api-router');
const AWS = require('aws-sdk');
const {
    getUniversalAccessToken,
    getPointsOfInterest
} = require('./src/utils');
const { DYNAMODB_TABLE_NAME } = process.env;

AWS.config.update({
   region: 'us-east-1'
});
const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const app = new Api();

app.get('/', async (req, res) => {
    const access_token = await getUniversalAccessToken();
    const poi = await getPointsOfInterest(access_token);
    res.json(poi);
});

app.get('/rides/:id', async (req, res) => {

    const before = moment().subtract(2, 'hours');
    const now = moment();
    console.log('[INFO] Before: ', before.toISOString(), before.valueOf());
    console.log('[INFO] Now: ', now.toISOString(), now.valueOf());

    try {
        const { Items } = await ddb.query({
            TableName: DYNAMODB_TABLE_NAME,
            KeyConditionExpression: 'pid = :pid AND sid BETWEEN :before AND :now',
            ExpressionAttributeValues: {
                ':pid': `RIDE-${req.params.id}`,
                ':before': `${before}`,
                ':now': `${now}`
            }
        }).promise();
        res.json(Items);
    } catch(err) {
        console.log('[ERROR] Failed to query for ride wait times within given range. ', err);
        res.status(500).json({ message: 'Failed to query for ride wait times within the given range. ', error: err });
    }

});


exports.handler = async (event, context) => app.listen(event, context);