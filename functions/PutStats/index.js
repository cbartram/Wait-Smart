const moment = require('moment');
const crypto = require('crypto');
const request = require('request-promise-native');
const AWS = require('aws-sdk');
const _ = require('lodash');
const URL = 'https://services.universalorlando.com/api';
const {
    CLIENT_ID,
    CLIENT_SECRET,
    DYNAMODB_TABLE_NAME
} = process.env;

AWS.config.update({ region: "us-east-1" });

const ddb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });
const today = moment.utc().format("ddd, DD MMM YYYY HH:mm:ss") + " GMT";

/**
 * Retrieves an OAuth access token for the Universal API
 * The access token is valid for only a short while < 1 hour
 * @returns {Promise<any>}
 */
const getAccessToken = async () => {
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

    try {
        const {Token} = JSON.parse(await request(options));
        console.log("[INFO] Universal API Access Token:", Token);
        return Token;
    } catch(err) {
        console.log('[ERROR] Failed to fetch API Access Token from Universal: ', err);
        return null;
    }
};


/**
 * Retrieves ride data from Universal and maps over it
 * to keep the id and wait time of each ride
 * @param token String OAuth access token
 * @returns {Promise<*>}
 */
const getWaitTimes = async (token) => {
    const ridesOptions = {
        'method': 'GET',
        'url': URL + '/pointsOfInterest',
        'headers': {
            'Date': today,
            'Content-Type': 'application/json; charset=UTF-8',
            'Accept': 'application/json',
            'X-UNIWebService-ApiKey': 'AndroidMobileApp',
            'X-UNIWebService-Token': token,
            'Accept-Language': 'en-US'
        },
    };
    try {
        return JSON.parse(await request(ridesOptions));
    } catch(err) {
        console.log('[ERROR] Failed to retrieve ride data from Universal API: ', err);
        return null;
    }
};

/**
 * Inserts an Item into DynamoDB using a PUT operation. This will
 * overwrite items with the same partition and sort key
 * @param Item Object item to insert
 * @returns {Promise<*>}
 */
const putItem = async (Item) => {
  const params = {
      TableName: DYNAMODB_TABLE_NAME,
      Item
  };

  try {
      return ddb.put(params).promise();
  } catch(err) {
      console.log(`[ERROR] Unable to put Item: ${JSON.stringify(Item, null, 2)}. Error: `, err);
      throw(err);
  }
};

/**
 * Creates a set of valid 25 item batches given an input array of items.
 * @param data Array of objects to be inserted in bulk into DynamoDB
 * @returns {[]}
 */
const createBatches = (data) => {
  const batches = [];
  let currBatch = {
      RequestItems: {
          [DYNAMODB_TABLE_NAME]: [],
      }
  };

  for(let i = 0; i < data.length; i++) {
      if (currBatch.RequestItems[DYNAMODB_TABLE_NAME].length === 25) {
          batches.push(currBatch);
          currBatch = {
              RequestItems: {
                  [DYNAMODB_TABLE_NAME]: []
              }
          }
      }
      currBatch.RequestItems[DYNAMODB_TABLE_NAME].push({
          PutRequest: {
              Item: {
                  pid: `RIDE-${data[i].id}`,
                  sid: moment().valueOf(),
                  ...data[i],
              }
          }
      });
  }

  if(currBatch.RequestItems[DYNAMODB_TABLE_NAME].length !== 0) batches.push(currBatch);
  return batches;
};

const batchWriteAndRetry = async (batches) => {
    const promises = [];
    let numFailed = 0;
    const unprocessedItems = [];

    console.log(`[INFO] Queued up ${batches.length} batches to write.`);
    for(let i = 0; i < batches.length; i++) {
        try {
            const { UnprocessedItems } = await ddb.batchWrite(batches[i]).promise();
            if(typeof UnprocessedItems[DYNAMODB_TABLE_NAME] !== 'undefined') {
                console.log(`[INFO] Batch write ${i} has some unprocessed items: ${JSON.stringify(UnprocessedItems)}`);
                UnprocessedItems[DYNAMODB_TABLE_NAME].forEach((request) => {
                    unprocessedItems.push(request.PutRequest.Item);
                });
            } else {
                console.log(`[INFO] Finished batch write #${i} successfully.`);
            }
        } catch(err) {
            console.log(`[ERROR] An error occurred while writing batch: #${i}`, err);
        }
    }

    if(unprocessedItems.length === 0) console.log('[INFO] All batch writes were successful!');
    else {
        for(let i = 0; i < unprocessedItems.length; i++) {
            try {
                console.log(`[INFO] Individually writing item into DynamoDB: ${JSON.stringify(unprocessedItems[i])}`);
                promises.push(putItem(unprocessedItems[i]));
            } catch(err) {
                numFailed++;
                console.log(`[ERROR] Unable to individually write item into DynamoDB: ${JSON.stringify(unprocessedItems[i])}. Error: `, err);
            }
        }
        console.log('[INFO] Awaiting promises....');
        await Promise.all(promises);
    }

    return numFailed;
};


exports.handler = async () => {

    if(!moment().isBetween(moment().hour(7), moment().hour(21))) {
        console.log(`[INFO] The current time: ${moment().format('hh:mm A')} is not between ${moment().hour(7).format('hh:mm A')} and ${moment().hour(21).format('hh:mm A')}`);
        return {
            total: 0,
            numAttempted: 0,
            successful: 0,
            failed: 0
        }
    }

    const token = await getAccessToken();

    const data = await getWaitTimes(token);
    const rides = data.Rides.map(ride => ({ id: ride.Id, wait: ride.WaitTime }));
    const batches = createBatches(rides);
    const numFailed = batchWriteAndRetry(batches);

    const parkRides = _.groupBy(data.Rides, 'VenueId');
    const parkIds = Object.keys(parkRides);

    // Compute averages for each park and returns a promise for each
    // item to insert into the database.
    const items = parkIds.map(id => {
        const item = {
            pid: `PARK-${id}`,
            sid: moment().valueOf(),
            wait: Math.floor(parkRides[id].reduce((prev, curr) => prev + curr.WaitTime, 0) / parkRides[id].length),
        };

        if(item.wait < 0) item.wait = 0;
        return putItem(item);
    });

    await Promise.all(items);

    return {
        total: rides.length,
        successful: rides.length - numFailed,
        failed: numFailed
    }
};