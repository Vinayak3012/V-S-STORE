require("dotenv").config();
const { Worker } = require("bullmq");
const {
  sendPlaceOrderEmail,
  sendConfirmationEmail,
  sendRejectionEmail,
  sendDeliveredEmail,
  sendLatestUpdateEmail,
} = require("./emailTasks");
const { CalAvgRating } = require("./simple_tasks");
const { analysis_of_sellers_monthly } = require("./simple_tasks");
const { analysis_of_product_monthly } = require("./simple_tasks");

const connection = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS,
  tls: {}, // TLS is required by Redis Cloud
};

const worker = new Worker(
  "emailQueue",
  async (job) => {
    console.log("Processing job:", job.name, job.data);
    if (job.name == "sendPlaceOrderEmail") {
      await sendPlaceOrderEmail(job.data);
    }
    if (job.name == "sendConfirmEmail") {
      await sendConfirmationEmail(job.data);
    }
    if (job.name == "sendRejectEmail") {
      await sendRejectionEmail(job.data);
    }
    if (job.name == "sendDeliveredEmail") {
      await sendDeliveredEmail(job.data);
    }
    if (job.name == "sendLatestUpdateEmail") {
      await sendLatestUpdateEmail(job.data);
    }
  },
  {
    connection: connection,
  }
);

const worker2 = new Worker(
  "ratingQueue",
  async (job) => {
    console.log("Processing job:", job.name, job.data);
    if (job.name == "CalAvgRating") {
      res = await CalAvgRating(job.data);
      console.log(res);
    }
  },
  {
    connection: connection,
  }
);

const worker3 = new Worker(
  "analysisQueue",
  async (job) => {
    console.log("Processing job:", job.name, job.data);
    if (job.name == "Seller_Analysis") {
      await analysis_of_sellers_monthly(job.data);
    }
    if (job.name == "Product_Analysis") {
      await analysis_of_product_monthly(job.data);
    }
  },
  {
    connection: connection,
    concurrency: 1, // 🔒 Only one job runs at a time
  }
);

worker.on("completed", (job) => {
  console.log(`Worker2 Job ${job.id} completed successfully!`);
});

worker.on("failed", (job, err) => {
  console.error(`Worker2 Job ${job.id} failed with error ${err.message}`);
});

worker2.on("completed", (job) => {
  console.log(`Worker2 Job ${job.id} completed successfully!`);
});

worker2.on("failed", (job, err) => {
  console.error(`Worker2 Job ${job.id} failed with error ${err.message}`);
});

worker3.on("completed", (job) => {
  console.log(`Worker1 Job ${job.id} completed successfully!`);
});

worker3.on("failed", (job, err) => {
  console.error(`Worker1 Job ${job.id} failed with error ${err.message}`);
});
