require("dotenv").config();
const { Queue } = require("bullmq");

const connection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS,
};

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
