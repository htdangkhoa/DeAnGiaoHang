const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Types = Schema.Types;

const Order = new Schema({
  _id: {
    type: Types.ObjectId,
    auto: true
  },
  userId: {
    type: Types.ObjectId,
    required: true
  },
  sPhone: {
    type: Types.String,
    required: true
  },
  sName: {
    type: Types.String,
    required: true
  },
  sAddress: {
    type: Types.String,
    required: true
  },
  rPhone: {
    type: Types.String,
    required: true
  },
  rName: {
    type: Types.String,
    required: true
  },
  rAddress: {
    type: Types.String,
    required: true
  },
  products: {
    type: [{ type: Types.Mixed }],
    default: []
  },
  status: {
    type: Types.String,
    default: "pending"
  },
  assignedFor: {
    type: Types.ObjectId
  }
});

module.exports = mongoose.model("orders", Order);
