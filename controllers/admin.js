const User = require("../models/user");
const Product = require("../models/product");
const Analysis = require("../models/analysis");

module.exports.dashview = (req, res) => {
  res.render("admin/dashboard.ejs");
};

module.exports.user = async (req, res) => {
  let users = await User.find().populate("profile");
  res.render("admin/user.ejs", { users });
};

module.exports.active_user = async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  user.status = true;
  await user.save();
  res.redirect("/admin/user");
};

module.exports.deactive_user = async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  user.status = false;
  await user.save();
  res.redirect("/admin/user");
};
module.exports.change_role = async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(id);
  user.role = "seller";
  await user.save();
  res.redirect("/admin/user");
};

module.exports.search = (req, res) => {
  res.redirect(`/admin/product?search=${req.body.query}`);
};

module.exports.product = async (req, res) => {
  let products = await Product.find();
  if (req.query.search) {
    let q = req.query.search.toLowerCase();
    products = products.filter((el) => {
      let s_product_name = el.name.toLowerCase();
      let s_product_brand = el.brand.toLowerCase();
      return s_product_brand.startsWith(q) || s_product_name.includes(q);
    });
  }
  res.render("admin/product.ejs", { products });
};

module.exports.graph = async (req, res) => {
  const overallData = await Analysis.find();
  const overallSellerData = await Analysis.aggregate([
    {
      $project: {
        data: { $zip: { inputs: ["$sellers", "$orders"] } },
      },
    },
    { $unwind: "$data" },
    {
      $group: {
        _id: { $arrayElemAt: ["$data", 0] }, // brand name
        totalOrders: { $sum: { $arrayElemAt: ["$data", 1] } },
      },
    },
    { $sort: { totalOrders: -1 } },
  ]);

  // console.log(overallSellerData);

  res.json({ overallData, overallSellerData });
};
