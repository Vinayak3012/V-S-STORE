require("dotenv").config();
const { Queue } = require("bullmq");

const IORedis = require("ioredis");

const connection = new IORedis(process.env.REDIS_URL);

//email asynchronous tasks
const emailQueue = new Queue("emailQueue", {
  connection: connection,
});

const ratingQueue = new Queue("ratingQueue", {
  connection: connection,
});

const analysisQueue = new Queue("analysisQueue", {
  connection: connection,
});

module.exports = { emailQueue, ratingQueue, analysisQueue };
