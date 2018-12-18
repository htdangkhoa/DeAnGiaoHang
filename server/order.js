const _ = require("lodash");

const router = require("express").Router();

const roles = require("./models/user.model").roles;

const Order = require("./models/order.model");

router.post("/order", function(req, res) {
  const userId = req.body.userId;

  const sPhone = req.body.sPhone;

  const sName = req.body.sName;

  const sAddress = req.body.sAddress;

  const sDistrict = req.body.sDistrict;

  const rPhone = req.body.rPhone;

  const rName = req.body.rName;

  const rAddress = req.body.rAddress;

  const rDistrict = req.body.rDistrict;

  const weight = req.body.weight;

  const productNames = req.body.productNames;

  const productDescriptions = req.body.productDescriptions;

  const productQuantities = req.body.productQuantities;

  const note = req.body.note;

  const charge = req.body.charge;

  const price = req.body.price;

  if (
    !userId ||
    !sPhone ||
    !sName ||
    !sAddress ||
    !sDistrict ||
    !rPhone ||
    !rName ||
    !rAddress ||
    !rDistrict ||
    !weight ||
    isNaN(weight) ||
    !note ||
    !charge ||
    !productNames ||
    !productQuantities ||
    !price ||
    isNaN(price)
  ) {
    return res.redirect(
      `/create-order?error=${encodeURI("Please enter full information.")}`
    );
  }

  var products = _.zipWith(
    _.isArray(productNames) ? productNames : [productNames],
    _.isArray(productDescriptions)
      ? productDescriptions
      : [productDescriptions],
    _.isArray(productQuantities) ? productQuantities : [productQuantities],
    function(name, description, quantity) {
      return {
        productName: name,
        productDescription: description,
        productQuantity: parseInt(quantity) || 1
      };
    }
  );

  new Order({
    userId: userId,
    sPhone: sPhone,
    sName: sName,
    sAddress: sAddress,
    rPhone: rPhone,
    rName: rName,
    rAddress: rAddress,
    products: products,
    weight: parseFloat(weight),
    price: parseFloat(price)
  }).save(function(error, order) {
    if (error) {
      console.log(error);

      return res.redirect(`/create-order?error=${encodeURI(error.message)}`);
    }

    return res.redirect(`/tracking-order?_id=${order._id}`);
  });
});

router.post("/assign", function(req, res) {
  const _id = req.body._id;

  const assignFor = req.body.assignFor;

  if (!_id || !assignFor) {
    return res.redirect(`/info?error=${encodeURI("Please choose employee.")}`);
  }

  return Order.findByIdAndUpdate(_id, { $set: { assignedFor: assignFor } })
    .then(function(order) {
      res.redirect("/info");
    })
    .catch(function(error) {
      console.log(error);

      return res.redirect(`/info?error=${encodeURI(error.message)}`);
    });
});

router.post("/update-status", function(req, res) {
  const _id = req.body._id;

  const role = req.body.role;

  const status = req.body.status;

  Order.findByIdAndUpdate(_id, { $set: { status: status } })
    .then(function(order) {
      if (!order) {
        return res.redirect(
          role === roles.USER
            ? `/cart?error=${encodeURI("Invalid order.")}`
            : `/info?error=${encodeURI("Invalid order.")}`
        );
      }

      return res.redirect(role === roles.USER ? "/cart" : "/info");
    })
    .catch(function(error) {
      console.log(error);

      return res.redirect(
        role === roles.USER
          ? `/cart?error=${encodeURI(error.message)}`
          : `/info?error=${encodeURI(error.message)}`
      );
    });
});

module.exports = router;
