const express = require("express");
const router = express.Router();
const { verifyUser, validateReview } = require("../middleware");
const wrapAsync = require("../utils/WrapAsync");
const reviewController = require("../controllers/review");

//review route
router.post(
  "/:id/review",
  verifyUser,
  validateReview,
  wrapAsync(reviewController.add)
);

router.delete(
  "/:id/:r_id/review",
  verifyUser,
  wrapAsync(reviewController.delete)
);

module.exports = router;
