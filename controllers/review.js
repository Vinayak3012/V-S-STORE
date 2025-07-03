const Review = require("../models/review");
const Product = require("../models/product");
const { ratingQueue } = require("../Queue_bullMQ");

module.exports.add = async (req, res) => {
  let { id } = req.params;
  let { rating, comment } = req.body;
  let { username } = req.user;
  const product = await Product.findById(id);
  const review = new Review({
    comment: comment,
    rating: rating,
    created_by: username,
  });
  product.reviews.push(review);
  await review.save();
  await product.save();
  await ratingQueue.add(
    "CalAvgRating",
    {
      product_id: product._id,
    },
    { delay: 60000 }
  );
  req.flash("success", "Review Added Successfully");
  res.redirect(`/product/${id}`);
};

module.exports.delete = async (req, res) => {
  let { id, r_id } = req.params;
  const product = await Product.findById(id);
  await Product.findByIdAndUpdate(id, { $pull: { reviews: r_id } });
  await Review.findByIdAndDelete(r_id);
  await ratingQueue.add(
    "CalAvgRating",
    {
      product_id: product._id,
    },
    { delay: 60000 }
  );
  req.flash("success", "Review Deleted Successfully");
  res.redirect(`/product/${id}`);
};
