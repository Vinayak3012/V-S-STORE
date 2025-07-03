const Product = require("../models/product");

module.exports.home = (req, res) => {
  res.render("products/home.ejs");
};

module.exports.search = (req, res) => {
  res.redirect(`/product?search=${req.body.query}`);
};
module.exports.seller_search = (req, res) => {
  res.redirect(`/product/seller?search=${req.body.query}`);
};

module.exports.all_products = async (req, res) => {
  let products;
  if (req.query) {
    let query = {};
    if (req.query.price && req.query.color) {
      if (req.query.price == 0) {
        if (!req.query.type && !req.query.gender) {
          query = {
            color: { $in: req.query.color },
          };
        } else {
          query = {
            type: req.query.type,
            gender: req.query.gender,
            color: { $in: req.query.color },
          };
        }
      } else {
        if (!req.query.type && !req.query.gender) {
          query = {
            color: { $in: req.query.color },
            price: { $lt: req.query.price },
          };
        } else {
          query = {
            type: req.query.type,
            gender: req.query.gender,
            color: { $in: req.query.color },
            price: { $lt: req.query.price },
          };
        }
      }
      products = await Product.find(query);

      //related to price
    } else if (req.query.price) {
      let query = {};
      if (!req.query.type && !req.query.gender) {
        query = { price: { $lt: req.query.price } };
      } else {
        query = {
          type: req.query.type,
          gender: req.query.gender,
          price: { $lt: req.query.price },
        };
      }

      products = await Product.find(query);
      //search query
    } else {
      if (req.query.search) {
        let all_products = await Product.find();
        let q = req.query.search.toLowerCase();
        products = all_products.filter((el) => {
          let s_product_name = el.name.toLowerCase();
          let s_product_brand = el.brand.toLowerCase();
          return s_product_brand.startsWith(q) || s_product_name.includes(q);
        });
      } else {
        // not suitable for all condition no query
        products = await Product.find(req.query);
      }
    }
    //no query
  } else {
    products = await Product.find();
  }
  products.query = req.query;
  res.render("products/all_products", { products });
};

module.exports.seller = async (req, res) => {
  let products = await Product.find({ owner: req.user.id });
  if (req.query.search) {
    let q = req.query.search.toLowerCase();
    products = products.filter((el) => {
      let s_product_name = el.name.toLowerCase();
      let s_product_brand = el.brand.toLowerCase();
      return s_product_brand.startsWith(q) || s_product_name.includes(q);
    });
  }
  res.render("products/seller_products", { products });
};

module.exports.new_get = (req, res) => {
  res.render("products/new");
};

module.exports.new_post = async (req, res) => {
  let product = req.body.product;
  let url = req.file.path;
  let filename = req.file.filename;
  // Parse the size field if it's a JSON string
  if (typeof product.size === "string") {
    try {
      product.size = JSON.parse(product.size);
    } catch (e) {
      product.size = [product.size]; // fallback to single value
    }
  }
  product.img = { url, filename };

  let newProduct = new Product(product);

  newProduct.owner = req.user.id;
  await newProduct.save();

  req.flash("success", "Product Added Successfully");
  res.redirect("/product");
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  await Product.findByIdAndDelete(id);
  req.flash("success", "Product Deleted Successfully");
  res.redirect("/product");
};

module.exports.edit_get = async (req, res) => {
  let product = await Product.findById(req.params.id);
  res.render("products/edit", { product });
};

module.exports.edit_put = async (req, res) => {
  const { id } = req.params;
  const productData = req.body.product;
  if (req.file) {
    let filename = req.file.filename;
    let url = req.file.path;
    productData.img = { url, filename };
  }

  if (typeof productData.size === "string") {
    try {
      productData.size = JSON.parse(productData.size);
    } catch (e) {
      productData.size = [productData.size]; // fallback to single value
    }
  }

  await Product.findByIdAndUpdate(id, productData);
  req.flash("success", "Product Edited Successfully");
  res.redirect(`/product/${id}`);
};

module.exports.product = async (req, res) => {
  let { id } = req.params;
  const product = await Product.findById(id).populate("reviews");
  let showReview = false;
  for (let review of product.reviews) {
    if (review.created_by === req.user.username) {
      showReview = true;
      break;
    }
  }
  product.showReview = showReview;
  res.render("products/product.ejs", { product });
};
