const { REDIS_PASSWORD } = process.env;
const redis = require('redis');
const bluebird = require('bluebird');
bluebird.promisifyAll(redis);

const { REDIS_HOST } = require('./constants');

let cache;
try {
    cache = redis.createClient({ host: REDIS_HOST, password: REDIS_PASSWORD, });
} catch (e) {
    console.log('[ERROR] Failed to connect to redis client: ', e);
}

module.exports = cache;