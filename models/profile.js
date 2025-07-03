const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  name: {
    type: String,
  },
  age: {
    type: Number,
    max: 100,
    min: 18,
  },
  phoneNo:{
    type:Number,
    max:9999999999,
    min:6999999999
  },
  gender: {
    type: String,
    enum:["male","female","other"],
  },
  //expand later
  address: {
    type: String,
  },
  //favorite or bookmark future functions
});

module.exports = mongoose.model("Profile",profileSchema);
