const Joi = require("joi");

module.exports.productSchema = Joi.object({
  product: Joi.object({
    name: Joi.string().required(),
    img: Joi.string().allow("", null),
    description: Joi.string().required(),
    gender: Joi.string().required(),
    type: Joi.string().required(),
    brand: Joi.string().required(),
    price: Joi.number().required().min(1),
    quantity: Joi.number().required().min(1),
    color: Joi.string().required(),
    size: Joi.string().required(),
  }).required(),
});

//it not under review['comment'] like other
module.exports.reviewSchema = Joi.object({
  rating: Joi.number().required().min(1).max(5),
  comment: Joi.string().required(),
});

module.exports.profileSchema = Joi.object({
  profile: Joi.object({
    name: Joi.string().required(),
    age: Joi.number().required().min(18).max(100),
    phoneNo: Joi.number().required().min(6999999999).max(9999999999),
    gender: Joi.string().required(),
    address: Joi.string().required(),
  }).required(),
});
