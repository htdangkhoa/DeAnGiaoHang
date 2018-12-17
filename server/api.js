const router = require("express").Router();
const md5 = require("md5");
const User = require("./models/user.model");

router.post("/signup", function(req, res) {
  const name = req.body.name;

  const email = req.body.email;

  const password = req.body.password;

  const address = req.body.address;

  const phone = req.body.phone;

  if (!name || !email || !password || !address || !phone) {
    return res.redirect(
      `/signup?error=${encodeURI("Please enter full information.")}`
    );
  }

  new User({
    name: name,
    email: email,
    password: password,
    address: address,
    phone: phone
  }).save(function(error, user) {
    if (error) {
      console.log(error);

      if (error.code === 11000) {
        return res.redirect(
          `/signup?error=${encodeURI("Email already exist.")}`
        );
      }

      return res.redirect(
        `/signup?error=${encodeURI("Somethings went wrong.")}`
      );
    }

    return res.redirect("/login");
  });
});

router.post("/login", function(req, res) {
  const email = req.body.email;

  const password = req.body.password;

  if (!email || !password) {
    return res.redirect(
      `/login?error=${encodeURI("Please enter full information.")}`
    );
  }

  User.findOne({ email: email })
    .then(function(user) {
      if (!user) {
        return res.redirect(
          `/login?error=${encodeURI("Email does not exist.")}`
        );
      }

      user.comparePassword(password, function(error, isMatch) {
        if (error || !isMatch) {
          return res.redirect(
            `/login?error=${encodeURI("Email or password is incorrect.")}`
          );
        }

        req.session[md5("user")] = {
          _id: user._id,
          name: user.name,
          email: user.email,
          address: user.address,
          phone: user.phone,
          role: user.role
        };

        return res.redirect("/");
      });
    })
    .catch(function(error) {
      return res.redirect(
        `/login?error=${encodeURI("Email or password is incorrect.")}`
      );
    });
});

router.get("/logout", function(req, res) {
  req.session = null;

  res.redirect("/");
});

module.exports = router;
