const redis = require("redis");

const redisClient = () => {
  return redis.createClient('redis://localhost:6379'); //process.env.REDIS_URI;
};

module.exports = {
  redisClient,
};
