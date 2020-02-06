require('dotenv').config();
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

app.get('/rides', async (req, res) => {
    const response = await ddb.query({
        TableName: DYNAMODB_TABLE_NAME,
        KeyConditionExpression: 'pid = :pid and begins_with()',
        ExpressionAttributeValues: {
            ':pid': 'RIDE',
            ':rkey': 2015
        }
    }).promise();
    res.json(response);
});


exports.handler = async (event, context) => app.listen(event, context);