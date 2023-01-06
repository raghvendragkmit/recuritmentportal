/* eslint-disable no-undef */
require('dotenv').config();
const redis = require('redis');

const getClient = () => {
  return redis.createClient(process.env.REDIS_HOST, process.env.REDIS_PORT);
};

let client = getClient();
const connect = () => {
  client.connect();
};

const get = async (key) => {
  const data = await client.get(key);
  return data;
};

const set = async (key, value, time = 1) => {
  return await client.set(key, value, { EX: time * process.env.REDIS_EXT });
};

const reset = async () => {
  return await client.reset();
};

const del = async (key) => {
  return await client.del(key);
};

module.exports = {
  connect,
  get,
  set,
  reset,
  del
};
