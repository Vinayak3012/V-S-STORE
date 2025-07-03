const Order = require("../models/order");
const User = require("../models/user");
const Product_Analysis = require("../models/productAnalysis.js");
const { analysisQueue, emailQueue } = require("../Queue_bullMQ.js");

module.exports.order = async (req, res) => {
  let user = await User.findById(req.user.id).populate("profile");
  let orders = await Order.find({ user: user }).populate("product");
  res.render("order/orders.ejs", { orders, user });
};

module.exports.checkOrder = async (req, res, next) => {
  let user = await User.findById(req.user.id);
  let orders = await Order.find()
    .populate("product")
    .populate({
      path: "user",
      populate: {
        path: "profile", // Assuming `profile` is inside `user`
      },
    });

  let myPlacedOrders = [];
  let myAcceptedOrders = [];
  for (let order of orders) {
    if (order.product.owner.equals(user._id)) {
      if (order.status === "Placed") {
        myPlacedOrders.push(order);
      }
    }
  }

  for (let order of orders) {
    if (order.product.owner.equals(user._id)) {
      if (order.status === "Accepted") {
        myAcceptedOrders.push(order);
      }
    }
  }

  res.render("order/checkOrders.ejs", {
    myPlacedOrders,
    myAcceptedOrders,
  });
};

module.exports.seller_accept = async (req, res) => {
  let { id } = req.params;
  let order = await Order.findById(id);
  let user = await User.findById(order.user).populate("profile");
  order.delivery_time = order.Time.setDate(order.Time.getDate() + 7);
  order.Time.setDate(order.Time.getDate() - 7);
  order.status = "Accepted";
  await order.save();
  await emailQueue.add(
    "sendConfirmEmail",
    {
      fullName: user.profile.name,
      email: user.email,
      order: order,
    },
    { delay: 60000 }
  );
  return res.redirect("/checkOrders");
};

module.exports.seller_reject = async (req, res) => {
  let { id } = req.params;
  let order = await Order.findById(id);
  let user = await User.findById(order.user).populate("profile");
  order.status = "Rejected";
  await order.save();
  await emailQueue.add(
    "sendRejectEmail",
    {
      fullName: user.profile.name,
      email: user.email,
      order: order,
    },
    { delay: 60000 }
  );
  res.redirect("/checkOrders");
};

module.exports.done = async (req, res) => {
  let { id } = req.params;
  let order = await Order.findById(id);
  let user = await User.findById(order.user).populate("profile");
  order.status = "Completed";
  order.isPaid = true;
  await order.save();
  await analysisQueue.add(
    "Product_Analysis",
    {
      order_id: order._id,
    },
    { delay: 70000 }
  );
  await analysisQueue.add(
    "Seller_Analysis",
    {
      order_id: order._id,
    },
    { delay: 60000 }
  );
  await emailQueue.add(
    "sendDeliveredEmail",
    {
      fullName: user.profile.name,
      email: user.email,
      order: order,
      address: user.profile.address,
    },
    { delay: 60000 }
  );
  res.redirect("/checkOrders");
};

module.exports.completeOrder = async (req, res) => {
  let user = await User.findById(req.user.id);
  let orders = await Order.find()
    .populate("product")
    .populate({
      path: "user",
      populate: {
        path: "profile", // Assuming `profile` is inside `user`
      },
    });
  let myCompletedOrders = [];
  for (let order of orders) {
    if (order.product.owner.equals(user._id)) {
      if (order.status === "Completed") {
        myCompletedOrders.push(order);
      }
    }
  }
  res.render("order/completedOrder.ejs", {
    orders: myCompletedOrders,
  });
};

module.exports.dash = (req, res) => {
  res.render("order/S_Dashboard");
};

module.exports.graph = async (req, res) => {
  let overallData = await Product_Analysis.find({ owner: req.user.id });
  const overallProductData = await Product_Analysis.aggregate([
    {
      $project: {
        data: { $zip: { inputs: ["$products", "$orders"] } },
      },
    },
    { $unwind: "$data" },
    {
      $group: {
        _id: { $arrayElemAt: ["$data", 0] }, // product name
        totalOrders: { $sum: { $arrayElemAt: ["$data", 1] } },
      },
    },
    { $sort: { totalOrders: -1 } },
  ]);

  res.json({ overallData, overallProductData });
};
