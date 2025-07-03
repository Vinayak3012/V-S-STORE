require("dotenv").config;
const jwt = require("jsonwebtoken");
//secret key for jwt
const secretKey = process.env.SECRET_KEY_AUTH;
const ExpressError = require("./utils/ExpressError.js");
const { productSchema, reviewSchema, profileSchema } = require("./schema.js");

module.exports.verifyUser = (req, res, next) => {
  const token = req.cookies.auth_token;
  if (!token) {
    // console.log(req.originalUrl);
    req.session.redirect_url = req.originalUrl;
    req.flash("error", "You have to login to access");
    return res.redirect("/login");
  }
  jwt.verify(token, secretKey, (error, user) => {
    //user is payload defined at time of jwt-sign
    if (error) {
      res.send("token error", error);
    }
    if (user.status == false) {
      res.send("Your id is blocked");
    }
    // console.log(user);
    req.user = user;
    next();
  });
};

//we can directly access req.session in any routes.
//1.access in ejs template
//2.future use req.session.redirect_url for other middleware and also use for this middleware
//3. res.locals only available at a time of request
module.exports.saveRedirect = (req, res, next) => {
  // console.log(req.session.redirect_url);
  if (req.session.redirect_url) {
    res.locals.redirect_url = req.session.redirect_url;
  }
  next();
};

module.exports.profileUrlRedirect = (req, res, next) => {
  // console.log(req.originalUrl);
  req.session.redirect_url = req.originalUrl;
  next();
};

module.exports.getUser = (req, res, next) => {
  const token = req.cookies.auth_token; // Get token from cookies
  if (token) {
    try {
      const decoded = jwt.verify(token, secretKey);
      req.user = decoded; // Attach user data
    } catch (error) {
      console.log("Invalid token, proceeding without user.");
      req.user = null; // Set to null if token is invalid
    }
  } else {
    req.user = null; // If no token, set user to null
  }

  res.locals.user = req.user; // Make user available in views
  next();
};

module.exports.isSeller = (req, res, next) => {
  if (req.user.role == "seller") {
    next();
  } else {
    next(new ExpressError(401, "Your are not Authorized to access this page"));
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.user.role == "admin") {
    next();
  } else {
    next(new ExpressError(401, "Your are not Authorized to access this page"));
  }
};

module.exports.validateProduct = (req, res, next) => {
  let { error } = productSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let newErr = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, newErr);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let newErr = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, newErr);
  } else {
    next();
  }
};

module.exports.validateProfile = (req, res, next) => {
  let { error } = profileSchema.validate(req.body);
  // console.log(error);
  if (error) {
    let newErr = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, newErr);
  } else {
    next();
  }
};
