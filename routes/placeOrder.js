const express = require("express");
const router = express.Router();
const { verifyUser, profileUrlRedirect } = require("../middleware");
const wrapAsync = require("../utils/WrapAsync");
const placeOrderController = require("../controllers/placeOrder.js");

//place order routes
router.post("/confirm", verifyUser, wrapAsync(placeOrderController.confirm));

router.get(
  "/checkout",
  verifyUser,
  profileUrlRedirect,
  wrapAsync(placeOrderController.checkout)
);

router
  .route("/proceed-to-pay/:id")
  .get(verifyUser, wrapAsync(placeOrderController.proceed_pay))
  .post(verifyUser, wrapAsync(placeOrderController.proceed_pay_post));

router
  .route("/place/:O_id")
  .get(verifyUser, wrapAsync(placeOrderController.place))
  .delete(verifyUser, wrapAsync(placeOrderController.place_delete));

//RAZOR PAY
router.post("/payment", verifyUser, wrapAsync(placeOrderController.payment));

router.post(
  "/payment/verify/:id",
  verifyUser,
  wrapAsync(placeOrderController.verify)
);

module.exports = router;
