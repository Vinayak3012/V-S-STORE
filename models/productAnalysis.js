const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const product_analysis_schema = new Schema({
  products: {
    type: [String],
  },
  orders: {
    type: [Number],
  },
  date: {
    type: Date,
  },
  owner: {
    type: String,
  },
});

const Product_Analysis = mongoose.model(
  "Product_Analysis",
  product_analysis_schema
);

module.exports = Product_Analysis;
