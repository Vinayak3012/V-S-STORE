require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/product");
const Order = require("./models/order");
const Analysis = require("./models/analysis");
const Product_Analysis = require("./models/productAnalysis");

const Redis = require("ioredis");
const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASS,
  tls: {}, // TLS is required by Redis Cloud
});

main()
  .then(() => {
    console.log("DB connected successfully!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL);
}

//Average Rating Calculation

async function CalAvgRating({ product_id }) {
  const product = await Product.findById(product_id).populate("reviews");
  let sum = 0;
  for (let review of product.reviews) {
    sum = sum + review.rating;
  }
  // console.log(sum / product.reviews.length);
  if (sum == 0 && product.reviews.length == 0) {
    product.avg_rating = undefined;
    console.log(product.avg_rating);
    await product.save();
  } else {
    product.avg_rating = sum / product.reviews.length;
    console.log(product.avg_rating);
    await product.save();
  }
}

//seller monthly order performance by order quantity sold

async function analysis_of_sellers_monthly({ order_id }) {
  const lockKey = "lock:seller-analysis";
  const locked = await redis.set(lockKey, "1", "NX", "PX", 5000); // 5 sec lock

  if (!locked) {
    console.log("Another analysis job is running. Skipping...");
    return;
  }

  try {
    const order = await Order.findById(order_id).populate("product");
    const date = new Date();
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    let analysis = await Analysis.findOne({
      date: { $gte: startOfMonth, $lt: endOfMonth },
    });

    if (!analysis) {
      // No analysis for this month
      const newAnalysis = new Analysis({
        sellers: [order.product.brand],
        orders: [order.quantity],
        date: new Date(),
      });
      await newAnalysis.save();
      return;
    }

    const brand = order.product.brand;
    const index = analysis.sellers.indexOf(brand);

    if (index !== -1) {
      analysis.orders[index] += order.quantity;
    } else {
      analysis.sellers.push(brand);
      analysis.orders.push(order.quantity);
    }

    await analysis.save();
  } catch (err) {
    console.error("Error in analysis:", err);
  } finally {
    await redis.del(lockKey);
  }
}

async function analysis_of_product_monthly({ order_id }) {
  const lockKey = "lock:product-analysis";
  const locked = await redis.set(lockKey, "1", "NX", "PX", 5000);

  if (!locked) {
    console.log("Another product analysis job is running. Skipping...");
    return;
  }

  try {
    const order = await Order.findById(order_id).populate("product");
    const date = new Date();
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);

    let analysis = await Product_Analysis.findOne({
      date: { $gte: startOfMonth, $lt: endOfMonth },
      owner: order.product.owner,
    });

    if (!analysis) {
      const newAnalysis = new Product_Analysis({
        products: [order.product.name],
        orders: [order.quantity],
        date: new Date(),
        owner: order.product.owner,
      });
      await newAnalysis.save();
      return;
    }

    const productName = order.product.name;
    const index = analysis.products.indexOf(productName);

    if (index !== -1) {
      analysis.orders[index] += order.quantity;
    } else {
      analysis.products.push(productName);
      analysis.orders.push(order.quantity);
    }

    await analysis.save();
  } catch (err) {
    console.error("Error in product analysis:", err);
  } finally {
    await redis.del(lockKey);
  }
}

module.exports = {
  CalAvgRating,
  analysis_of_sellers_monthly,
  analysis_of_product_monthly,
};
