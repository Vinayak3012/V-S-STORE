const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/WrapAsync");
const { verifyUser, saveRedirect } = require("../middleware.js");
const userController = require("../controllers/user.js");

//SignUp Route
router
  .route("/signup")
  .get(userController.get_signup)
  .post(wrapAsync(userController.signup));

//LOGIN Route
router
  .route("/login")
  .get(userController.get_login)
  .post(saveRedirect, wrapAsync(userController.login));

router.get("/logout", verifyUser, userController.logout);

module.exports = router;
