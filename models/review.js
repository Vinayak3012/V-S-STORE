const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    max: 5,
    min: 1,
    default: 1,
  },
  comment: {
    type: String,
  },
  created_at: {
    type: Date,
    default: new Date(),
  },
  created_by:{
    type:String,
  }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
