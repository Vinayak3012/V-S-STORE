const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware");
const wrapAsync = require("../utils/WrapAsync");
const cartController = require("../controllers/cart");

//CART
router
  .route("/:id")
  .post(verifyUser, wrapAsync(cartController.cart_post))
  .delete(verifyUser, wrapAsync(cartController.cart_delete));

router.get("/", verifyUser, wrapAsync(cartController.cart_get));

module.exports = router;
