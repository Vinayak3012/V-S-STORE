const express = require("express");
const router = express.Router();
const { verifyUser, isAdmin } = require("../middleware");
const wrapAsync = require("../utils/WrapAsync");
const adminController = require("../controllers/admin");

router.get("/", verifyUser, isAdmin, adminController.dashview);

//MANAGE USERS
router.get("/user", verifyUser, isAdmin, wrapAsync(adminController.user));

router.get(
  "/status/active/:id",
  verifyUser,
  isAdmin,
  wrapAsync(adminController.active_user)
);

router.get(
  "/status/deactive/:id",
  verifyUser,
  isAdmin,
  wrapAsync(adminController.deactive_user)
);

router.get(
  "/role/seller/:id",
  verifyUser,
  isAdmin,
  wrapAsync(adminController.change_role)
);

//MANAGE PRODUCTS
//admin products
//search for seller
router.post("/search", verifyUser, isAdmin, adminController.search);
router.get("/product", verifyUser, isAdmin, wrapAsync(adminController.product));

//MANAGE GRAPH
router.get(
  "/graph/brand/data",
  verifyUser,
  isAdmin,
  wrapAsync(adminController.graph)
);

module.exports = router;
