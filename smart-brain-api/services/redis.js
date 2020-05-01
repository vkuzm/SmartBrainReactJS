const redis = require("redis");

const redisClient = () => {
  return redis.createClient(process.env.REDIS_URI);
};

module.exports = {
  redisClient,
};
