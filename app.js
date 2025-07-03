require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT;
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const ejsMate = require("ejs-mate");

//routes
const productRoute = require("./routes/product");
const userRoute = require("./routes/user");
const reviewRoute = require("./routes/review");
const cartRoute = require("./routes/cart");
const profileRoute = require("./routes/profile.js");
const placeOrderRoute = require("./routes/placeOrder.js");
const orderRoute = require("./routes/order.js");
const adminRoute = require("./routes/admin.js");

const methodOverride = require("method-override");
const ExpressError = require("./utils/ExpressError");
//session local
const session = require("express-session");
const flash = require("connect-flash");

const { getUser } = require("./middleware.js");
const { emailQueue } = require("./Queue_bullMQ.js");

//session online
const MongoStore = require("connect-mongo");

main()
  .then(() => {
    console.log("DB connected successfully!");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json()); // ✅ Parses JSON body
app.use(express.urlencoded({ extended: true })); // ✅ Parses form data
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate); // for includes and layouts
app.use(methodOverride("_method"));
app.use(cookieParser());

//mongo-session option
const store = MongoStore.create({
  mongoUrl: process.env.DB_URL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600, //time after data gone
});

store.on("error", (err) => {
  console.log("Error in mongo session store", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    //day hour min sec msec
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // to prevent from cross scripting attacks
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(getUser); // Ensure user info is always available

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

//Routes
app.use("/", placeOrderRoute);
app.use("/", userRoute);
app.use("/", orderRoute);
app.use("/product", productRoute);
app.use("/product", reviewRoute);
app.use("/cart", cartRoute);
app.use("/profile", profileRoute);
app.use("/admin", adminRoute);

//main Home page
app.get("/", (req, res) => {
  res.render("users/home.ejs");
});

app.post("/subscribe", async (req, res) => {
  let { email } = req.body;
  await emailQueue.add(
    "sendLatestUpdateEmail",
    {
      email: email,
    },
    { delay: 40000 }
  );
  res.redirect("/");
});

// page not found
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

//error catching middleware
app.use((err, req, res, next) => {
  console.log(err);
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(port, () => {
  console.log(`server is listening at ${port}`);
});
