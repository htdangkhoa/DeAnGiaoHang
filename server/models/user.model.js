const md5 = require("md5");

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Types = Schema.Types;

const roles = {
  USER: "USER",
  EMPLOYEE: "EMPLOYEE",
  ADMIN: "ADMIN"
};

const User = new Schema({
  _id: {
    type: Types.ObjectId,
    auto: true
  },
  email: {
    type: Types.String,
    unique: true
  },
  password: {
    type: Types.String
  },
  name: {
    type: Types.String
  },
  address: {
    type: Types.String
  },
  phone: {
    type: Types.String
  },
  role: {
    type: Types.String,
    default: roles.USER
  }
}, {
  timestamps: true
});

User.pre("save", function(next) {
  var user = this;

  if (!user.isModified("password")) {
    return next();
  }

  user.password = md5(user.password);

  next();
});

User.methods.comparePassword = function(password, next) {
  var user = this;

  var isMatch = user.password === md5(password);

  next(null, isMatch);
};

module.exports = mongoose.model("users", User);

module.exports.roles = roles