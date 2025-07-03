const express = require("express");
const router = express.Router();
const { verifyUser, isSeller } = require("../middleware");
const wrapAsync = require("../utils/WrapAsync");
const orderControllers = require("../controllers/order.js");

router.get("/orders", verifyUser, wrapAsync(orderControllers.order));

router.get(
  "/checkOrders",
  verifyUser,
  isSeller,
  wrapAsync(orderControllers.checkOrder)
);

//change order status by seller
router.get(
  "/sellerAccept/:id",
  verifyUser,
  isSeller,
  wrapAsync(orderControllers.seller_accept)
);

router.get(
  "/sellerReject/:id",
  verifyUser,
  isSeller,
  wrapAsync(orderControllers.seller_reject)
);

//delivery done
router.get(
  "/isDone/:id",
  verifyUser,
  isSeller,
  wrapAsync(orderControllers.done)
);

router.get(
  "/checkCompletedOrders",
  verifyUser,
  isSeller,
  wrapAsync(orderControllers.completeOrder)
);

router.get("/seller/dashboard", verifyUser, isSeller, orderControllers.dash);

router.get(
  "/graph/data/product",
  verifyUser,
  isSeller,
  wrapAsync(orderControllers.graph)
);

module.exports = router;
