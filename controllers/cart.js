const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

module.exports.cart_post = async (req, res) => {
  let { id } = req.params;
  let { size } = req.body;
  let product = await Product.findById(id);
  let user = await User.findById(req.user.id);
  let item = user.cart.find((el) => {
    return product._id.equals(el.item);
  });
  if (!item) {
    const newItem = {
      item: product._id, // The product reference
      selectedSize: size,
      quantity: 1,
    };
    user.cart.push(newItem);
    await user.save();
    req.flash("success", "Item Added Successfully");
    res.redirect(`/product/${id}`);
  } else {
    req.flash("error", "Item Already In Cart");
    res.redirect(`/product/${id}`);
  }
};

module.exports.cart_get = async (req, res) => {
  const user = await User.findById(req.user.id);
  const populatedCart = await Promise.all(
    user.cart.map(async (cartItem) => {
      if (cartItem.item) {
        const product = await Product.findById(cartItem.item);
        return {
          ...cartItem, // Spread the original cart item
          item: product, // Manually populate the item
        };
      }
      return cartItem; // If no item, return the cartItem as is
    })
  );
  let orders = await Order.find({
    user: user,
    status: "InProgress",
  }).populate("product");
  // console.log(populatedCart); // Manually populated cart
  res.render("bag/cart.ejs", { populatedCart, orders });
};

module.exports.cart_delete = async (req, res) => {
  let { id } = req.params;
  let user = await User.findById(req.user.id);
  let product = await Product.findById(id);
  user.cart = user.cart.filter((el) => {
    return !product._id.equals(el.item._id);
  });
  await user.save();
  req.flash("success", "Product Removed");
  res.redirect("/cart");
};
