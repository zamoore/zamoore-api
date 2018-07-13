'use strict';

// External modules
const bluebird = require('bluebird');
const redis = require('redis');

// Promisify redis
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

// Start redis client
const client = redis.createClient();

client.on('error', () => process.exit(1));

module.exports = client;
