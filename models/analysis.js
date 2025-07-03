const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const analysis_schema = new Schema({
  sellers: {
    type: [String],
  },
  orders: {
    type: [Number],
  },
  date: {
    type: Date,
  },
});

const Analysis = mongoose.model("Analysis", analysis_schema);

module.exports = Analysis;
