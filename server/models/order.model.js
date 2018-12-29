const mongoose = require("mongoose");

const paging = require("mongoose-paginate");

const Schema = mongoose.Schema;

const Types = Schema.Types;

const Order = new Schema(
  {
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
    price: {
      type: Types.Number,
      required: true
    },
    weight: {
      type: Types.Number,
      required: true
    },
    status: {
      type: Types.String,
      default: "pending",
      lowercase: true
    },
    assignedFor: {
      type: Types.ObjectId
    },
    shipInTime: {
      type: Types.Boolean,
      default: false
    },
    isSuccessed: {
      type: Types.Boolean,
      default: false
    },
    isCanceled: {
      type: Types.Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

Order.plugin(paging);

module.exports = mongoose.model("orders", Order);

module.exports.limit = 3;