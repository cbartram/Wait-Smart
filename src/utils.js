/**
 * Utils.js
 * This file contains a list of commonly used functions throughout different
 * API routes.
 */
const moment = require('moment');
const crypto = require('crypto');
const request = require('request-promise-native');
const {
    CLIENT_ID,
    CLIENT_SECRET,
    NODE_ENV
} = process.env;
const { URL } = require('./constants');

/**
 * Retrieves the universal OAuth access token. The token is valid
 * for one hour after the retrieval time.
 */
const getUniversalAccessToken = async () => {
    const today = `${moment.utc().format('ddd, DD MMM YYYY HH:mm:ss')} GMT`;
    const signatureBuilder = crypto.createHmac('sha256', CLIENT_SECRET || 'default');
    signatureBuilder.update(`${CLIENT_ID || 'default'}\n${today}\n`);
    const signature = signatureBuilder.digest('base64').replace(/=$/, '\u003d');
    const options = {
        timeout: 5000,
        method: 'POST',
        url: URL,
        headers: {
            'Date': today,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ apiKey: CLIENT_ID, signature })
    };

    try {
        const response = await request(options);
        const { Token } = JSON.parse(response);
        NODE_ENV !== 'test' && console.log('[INFO] Successfully retrieved Universal OAuth access_token: ', Token);
        return Token;
    } catch(err) {
        console.log('[ERROR] There was an error retrieving the universal access_token.', err);
        throw(err);
    }
};


/**
 * Determines if a park id is valid or invalid. Note: if the number of integers exceeds 6 it will
 * match the first 6 integers.
 * @param parkId String park id to check.
 * @returns {boolean} Returns true if the park id is valid and false otherwise.
 */
const isValidParkId = (parkId) => {
    let regex = new RegExp('\\d{4,6}');
    return regex.test(parkId);
}


/**
 * Returns all points of interest data from the Universal API
 * @param access_token String the API access token retrieved from the #getUniversalAccessToken() API call
 * @returns {Promise<any>}
 */
const getPointsOfInterest = async (access_token) => {
    const ridesOptions = {
        'method': 'GET',
        'url': `${URL}/pointsOfInterest`,
        'headers': {
            'Date': `${moment.utc().format("ddd, DD MMM YYYY HH:mm:ss")} GMT`,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'X-UNIWebService-ApiKey': 'AndroidMobileApp',
            'X-UNIWebService-Token': access_token,
            'Accept-Language': 'en-US'
        },
    };
    try {
        const response = await request(ridesOptions);
        return JSON.parse(response);
    } catch(err) {
        console.log('[ERROR] There was an error retrieving the universal points of interest.', err);
        throw(err);
    }
};

// console.log(moment.utc().format("ddd, DD MMM YYYY HH:mm:ss"))
// getUniversalAccessToken();

module.exports = {
    getUniversalAccessToken,
    getPointsOfInterest,
    isValidParkId
};