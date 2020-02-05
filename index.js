require('dotenv').config();
const moment = require('moment');
const crypto = require('crypto');
const request = require('request-promise-native');
const Api = require('lambda-api-router');

const { URL } = require('./src/constants');
const {
    CLIENT_ID,
    CLIENT_SECRET
} = process.env;
const app = new Api();

app.get('/', async (req, res) => {
    const today = moment.utc().format("ddd, DD MMM YYYY HH:mm:ss") + " GMT";

    const signatureBuilder = crypto.createHmac("sha256", CLIENT_SECRET);
    signatureBuilder.update(CLIENT_ID + "\n" + today + "\n");
    const signature = signatureBuilder.digest("base64").replace(/=$/, "=");

    const options = {
        'method': 'POST',
        'url': URL,
        'headers': {
            'Date': today,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey: CLIENT_ID, signature })

    };

    const { Token } = JSON.parse(await request(options));
    console.log("[INFO] API Access Token:", Token);

    const ridesOptions = {
        'method': 'GET',
        'url': URL + '/pointsOfInterest',
        'headers': {
            'Date': today,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'X-UNIWebService-ApiKey': 'AndroidMobileApp',
            'X-UNIWebService-Token': Token,
            'Accept-Language': 'en-US'
        },
    };
    const ridesResponse = await request(ridesOptions);
    res.json(JSON.parse(ridesResponse));
});


exports.handler = async (event, context) => app.listen(event, context);