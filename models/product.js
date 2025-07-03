const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
  },
  img: {
    url: String,
    filename: String,
  },
  brand: {
    type: String,
  },
  type: {
    type: String,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
  },
  price: {
    type: Number,
  },
  description: {
    type: String,
  },
  size: {
    type: [String],
  },
  quantity: {
    type: Number,
    min: 0,
  },
  color: {
    type: String,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  avg_rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  discount: {
    type: Number,
    min: 1,
    max: 99,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

productSchema.post("findOneAndDelete", async (product) => {
  if (product) {
    await Review.deleteMany({ _id: { $in: product.reviews } }); //contains all ids

    //to delete cart product of all users if product are deleted
    let users = await User.find({ "cart.item": product._id });
    // console.log(users);
    users.forEach(async (user) => {
      user.cart = user.cart.filter((el) => {
        return !product._id.equals(el.item._id);
      });
      // console.log(user.cart);
      await user.save();
    });
  }
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
