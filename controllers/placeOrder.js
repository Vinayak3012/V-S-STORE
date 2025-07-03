const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { emailQueue } = require("../Queue_bullMQ.js");

module.exports.confirm = async (req, res) => {
  let user = await User.findById(req.user.id);
  // if (req.body == null) {
  //   return res.json({ success: false });
  // }
  for (let element of req.body) {
    // console.log(element.price);
    let order = new Order({
      user: user._id,
      status: "InProgress",
      product: element._id,
      amount: element.price,
      selectedSize: element.selectedSize,
      quantity: element.quantity,
    });
    let product = await Product.findById(order.product);
    if (order.quantity > product.quantity) {
      return res.json({
        success: false,
        message: `Unfortunately! for this product only ${product.quantity} quantity left`,
      });
    }
    await order.save();
    user.cart = user.cart.filter((el) => {
      return !order.product._id.equals(el.item._id);
    });
    await user.save();
  }
  // ✅ Respond with success JSON instead of flash + redirect
  req.flash("success", "Order generated successfully!");
  res.json({ success: true });
};

module.exports.checkout = async (req, res) => {
  let { id } = req.user;
  let user = await User.findById(id).populate("profile");
  let orders = await Order.find({
    user: user,
    status: "InProgress",
  }).populate("product");
  res.render("order/checkout.ejs", { orders, user });
};

module.exports.proceed_pay = async (req, res) => {
  let order = await Order.findById(req.params.id);
  res.render("order/payment.ejs", { order });
};

module.exports.proceed_pay_post = async (req, res) => {
  let { mode } = req.body;
  if (mode == "") {
    req.flash("error", "Please select payment method!");
    res.redirect("/checkout");
  }
  let user = await User.findById(req.user.id).populate("profile");
  if (!user.profile) {
    req.flash("error", "Please complete your profile!");
    res.redirect("/checkout");
  } else {
    let order = await Order.findById(req.params.id);
    (order.mode = mode), await order.save();
    res.redirect(`/proceed-to-pay/${order._id}`);
  }
};

module.exports.place = async (req, res) => {
  let { O_id } = req.params;
  let user = await User.findById(req.user.id).populate("profile");
  let order = await Order.findById(O_id);

  if (order.mode == "cash on delivery") {
    let product = await Product.findById(order.product._id);
    product.quantity = product.quantity - order.quantity;
    await product.save();
    user.cart = user.cart.filter((el) => {
      return !product._id.equals(el.item._id);
    });
    await user.save();
    order.status = "Placed";
    await order.save();
    req.flash("success", "Order Placed Successfully");
    await emailQueue.add(
      "sendPlaceOrderEmail",
      {
        fullName: user.profile.name,
        email: user.email,
        order: order,
      },
      { delay: 60000 }
    );
    res.redirect("/orders");
  }
  if (order.mode == "pay online" && order.isPaid == true) {
    let product = await Product.findById(order.product._id);
    product.quantity = product.quantity - order.quantity;
    await product.save();
    user.cart = user.cart.filter((el) => {
      return !product._id.equals(el.item._id);
    });
    await user.save();
    order.status = "Placed";
    await order.save();
    await emailQueue.add(
      "sendPlaceOrderEmail",
      {
        fullName: user.profile.name,
        email: user.email,
        order: order,
      },
      { delay: 60000 }
    );
    req.flash("success", "Order Placed Successfully");
    res.redirect("/orders");
  }
};

module.exports.place_delete = async (req, res) => {
  let { O_id } = req.params;
  await Order.findByIdAndDelete(O_id);
  req.flash("success", "Order Removed Successfully!");
  res.redirect("/checkout");
};

module.exports.payment = async (req, res) => {
  const order = await Order.findById(req.body.id).populate("product");
  if (!order.amount) return res.json({ message: "Please Provide Amount!" });

  //Create a INSTANce of RazorPAy
  const razorpayInstance = new Razorpay({
    key_id: process.env.TEST_KEY_ID,
    key_secret: process.env.TEST_KEY_SECRET,
  });
  const paymentOptions = {
    amount: order.amount * 100, //it require convert value to 1 paise to 1 rupee
    currency: "INR",
    receipt: "#1",
  };
  const razorpayOrder = await razorpayInstance.orders.create(paymentOptions);
  return res.json({
    message: "success",
    order: razorpayOrder,
    orderInfo: order,
    key: process.env.TEST_KEY_ID,
  });
};

module.exports.verify = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const secret = process.env.TEST_KEY_SECRET;

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generatedSignature === razorpay_signature) {
    let { id } = req.params;
    let order = await Order.findById(id);
    order.isPaid = true;
    await order.save();
    req.flash("success", "Payment Done successfully!");
    res.json({
      success: true,
      message: "Payment verified successfully",
      order: order,
    });
  } else {
    req.flash("error", "Payment unsuccessfully!");
    res
      .status(400)
      .json({ success: false, message: "Payment verification failed" });
  }
};
