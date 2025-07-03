const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const orderSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  order_id: {
    type: String,
    default: uuidv4(),
  },
  Time: {
    type: Date,
    default: new Date(),
  },
  delivery_time: {
    type: Date,
  },
  status: {
    type: String,
    enum: [
      "InProgress",
      "Accepted",
      "Pending",
      "Rejected",
      "Completed",
      "Placed",
    ],
  },
  amount: {
    type: Number,
  },
  selectedSize: {
    type: String,
  },
  quantity: {
    type: Number,
  },
  isPaid: {
    type: Boolean,
    default: false,
  },
  mode: {
    type: String,
    enum: ["cash on delivery", "pay online"],
  },
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
