const { createClient } = require("redis");
require("dotenv").config();

const redisUrl =
  process.env.REDIS_URL || "redis://localhost:6379";

const client = createClient({
  url: redisUrl
});

client.on("error", (error) => {
  console.log("Redis error:", error.message);
});

let connectPromise;

const getClient = async () => {
  if (!connectPromise) {
    connectPromise = client.connect()
      .then(() => {
        console.log("Redis Connected");
        return client;
      })
      .catch((error) => {
        console.log("Redis connection failed:", error.message);
        connectPromise = null;
        return null;
      });
  }

  return connectPromise;
};

const getCache = async (key) => {
  const redisClient = await getClient();

  if (!redisClient) {
    return null;
  }

  try {
    const value = await redisClient.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.log("Redis get failed:", error.message);
    return null;
  }
};

const setCache = async (key, value, ttlSeconds) => {
  const redisClient = await getClient();

  if (!redisClient) {
    return;
  }

  try {
    await redisClient.set(
      key,
      JSON.stringify(value),
      {
        EX: ttlSeconds
      }
    );
  } catch (error) {
    console.log("Redis set failed:", error.message);
  }
};

const deleteCache = async (keys) => {
  const redisClient = await getClient();
  const cacheKeys = Array.isArray(keys) ? keys : [keys];

  if (!redisClient || cacheKeys.length === 0) {
    return;
  }

  try {
    await redisClient.del(cacheKeys);
  } catch (error) {
    console.log("Redis delete failed:", error.message);
  }
};

const deleteByPattern = async (pattern) => {
  const redisClient = await getClient();

  if (!redisClient) {
    return;
  }

  try {
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.log("Redis pattern delete failed:", error.message);
  }
};

module.exports = {
  getCache,
  setCache,
  deleteCache,
  deleteByPattern
};
