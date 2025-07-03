const express = require("express");
const router = express.Router();
const { verifyUser, saveRedirect, validateProfile } = require("../middleware");
const wrapAsync = require("../utils/WrapAsync");
const profileController = require("../controllers/profile");

router
  .route("/")
  .get(verifyUser, wrapAsync(profileController.show))
  .post(
    verifyUser,
    saveRedirect,
    validateProfile,
    wrapAsync(profileController.add)
  );

router.put(
  "/edit",
  verifyUser,
  saveRedirect,
  validateProfile,
  wrapAsync(profileController.edit)
);

module.exports = router;
