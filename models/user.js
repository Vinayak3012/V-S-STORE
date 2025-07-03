const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["user", "admin", "seller"],
  },
  profile: {
    type: Schema.Types.ObjectId,
    ref: "Profile",
  },
  cart: [{ type: Schema.Types.Mixed }],
  orders: [
    {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
