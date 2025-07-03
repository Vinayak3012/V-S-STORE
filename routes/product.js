const express = require("express");
const router = express.Router();

const { verifyUser, isSeller, validateProduct } = require("../middleware");
const wrapAsync = require("../utils/WrapAsync");
const productController = require("../controllers/product.js");

//for parse multipart/form-data
const multer = require("multer");
const { storage } = require("../cloudinary.js");

const upload = multer({ storage });

//home
router.get("/home", productController.home);

//search for user
router.post("/search", productController.search);

//search for seller
router.post("/seller/search", productController.seller_search);

//PRODUCTS - All route
router.route("/").get(wrapAsync(productController.all_products));

//seller products
router.get(
  "/seller",
  verifyUser,
  isSeller,
  wrapAsync(productController.seller)
);

//new products
router
  .route("/new")
  .get(verifyUser, productController.new_get)
  .post(
    verifyUser,
    upload.single("product[img]"),
    validateProduct,
    wrapAsync(productController.new_post)
  );

//delete
router
  .route("/:id")
  .get(verifyUser, wrapAsync(productController.product))
  .delete(verifyUser, wrapAsync(productController.delete));

//edit route
router.get("/edit/:id", verifyUser, wrapAsync(productController.edit_get));

router.put(
  "/:id/edit",
  verifyUser,
  upload.single("product[img]"),
  validateProduct,
  wrapAsync(productController.edit_put)
);

//show route

module.exports = router;
