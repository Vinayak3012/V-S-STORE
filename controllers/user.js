require("dotenv").config();
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

//secret key for jwt
const secretKey = process.env.SECRET_KEY_AUTH;

module.exports.get_signup = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  let { username, email, password } = req.body;

  if (username.length < 8) {
    req.flash("error", "Username at least has 8 character");
    res.redirect("/signup");
  }

  if (password.length < 8) {
    req.flash("error", "Password at least has character or numbers");
    res.redirect("/signup");
  }
  const hash = await bcryptjs.hash(password, 10);
  let user = new User({
    username: username,
    email: email,
    password: hash,
    status: true,
    role: "user",
  });
  await user.save();
  req.flash("success", "SignUp Successful");
  res.redirect("/login");
};

module.exports.get_login = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  let { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    req.flash("error", "Username or Password is Invalid");
    return res.redirect("/login");
  }
  const isMatch = await bcryptjs.compare(password, user.password);
  if (isMatch) {
    //jwt.sign(payload,secretkey,expires_in
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        role: user.role,
        status: user.status,
      },
      secretKey,
      { expiresIn: "1h" }
    );
    // console.log(token);
    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000,
    });
    req.flash("success", "Welcome To V & S");
    let redirectUrl = res.locals.redirect_url || "/product/home";
    delete req.session.redirect_url;
    res.redirect(redirectUrl);
  } else {
    req.flash("error", "Username or Password is Invalid");
    res.redirect("/login");
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("auth_token", {
    httpOnly: true,
    secure: true,
    sameSite: "Strict",
  });
  req.flash("success", "You are logout successfully!");
  return res.redirect("/product/home");
};
