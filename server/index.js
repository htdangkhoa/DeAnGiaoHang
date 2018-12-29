const config = require("../config");

const path = require("path");
const express = require("express");
const favicon = require("serve-favicon");
const cookieSession = require("cookie-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const swig = require("swig");
const mongoose = require("mongoose");
const md5 = require("md5");
const moment = require("moment");

const api = require("./api");
const order = require("./order");

const User = require("./models/user.model");
const Order = require("./models/order.model");

const isDev = process.argv.slice(2)[0] !== "production";

swig.setDefaults({ cache: isDev ? false : "memory" });

mongoose.connect(
  isDev ? config.DEV_DB : config.PROD_DB,
  { useNewUrlParser: true },
  function(error) {
    if (error) {
      console.log(error);

      process.exit(1);
    }

    console.log(`Connect to DB success.`);
  }
);

const app = express();

app.use([
  favicon(path.join(__dirname, "../public/assets/favicon.ico")),
  bodyParser.json(),
  bodyParser.urlencoded({ extended: false }),
  cors(),
  helmet(),
  cookieParser(config.SECRET),
  cookieSession({
    name: config.SECRET,
    secret: config.SECRET,
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  })
]);

app.engine("html", swig.renderFile);
app.set("view engine", "html");
app.set("views", path.join(__dirname, "../public"));
app.set("view cache", true);

app.use(
  "/components",
  express.static(path.join(__dirname, "../public/components"))
);
app.use("/js", express.static(path.join(__dirname, "../public/js")));
app.use("/css", express.static(path.join(__dirname, "../public/css")));
app.use("/assets", express.static(path.join(__dirname, "../public/assets")));

app.use(function(req, res, next) {
  const error = req.query.error;

  const user = req.session[md5("user")];

  var _render = res.render;

  res.render = function(view, options, callback) {
    _render.call(res, view, { ...options, user: user, error: error }, callback);
  };

  next();
});

app.get("/", function(req, res) {
  res.render("index", { title: config.TITLES.INDEX });
});

app.get("/about", function(req, res) {
  res.render("about", { title: config.TITLES.ABOUT });
});

app.get("/contact", function(req, res) {
  res.render("contact", { title: config.TITLES.CONTACT });
});

app.get("/login", function(req, res) {
  res.render("login", { title: config.TITLES.LOGIN });
});

app.get("/signup", function(req, res) {
  res.render("signup", { title: config.TITLES.SIGN_UP });
});

app.get("/info", function(req, res) {
  const page = req.query.page;

  const user = req.session[md5("user")];

  const limit = Order.limit;

  // For USER.
  if (!user) {
    return res.redirect("/login");
  }

  if (user.role === User.roles.USER) {
    return res.render("info", { title: config.TITLES.INFO });
  }

  // For EMPLOYEE.
  if (user.role === User.roles.EMPLOYEE) {
    return Order.paginate(
      {
        isSuccessed: false,
        assignedFor: user._id
      },
      { offset: (page - 1) * limit || 1, limit: limit }
    )
      .then(function(result) {
        const orders = result.docs;

        const pages = Math.ceil(result.total / limit);

        User.find({ role: User.roles.EMPLOYEE })
          .then(function(users) {
            return res.render("info", {
              title: config.TITLES.INFO,
              orders: orders,
              pages: pages,
              employees: users,
              path: req.path
            });
          })
          .catch(function(error) {
            return res.render("info", {
              title: config.TITLES.INFO,
              error: error
            });
          });
      })
      .catch(function(error) {
        return res.render("info", { title: config.TITLES.INFO, error: error });
      });
  }

  // For ADMIN.
  return Order.paginate({}, { offset: (page - 1) * limit || 1, limit: limit })
    .then(function(result) {
      const orders = result.docs;

      const pages = Math.ceil(result.total / limit);

      User.find({ role: User.roles.EMPLOYEE })
        .then(function(users) {
          return res.render("info", {
            title: config.TITLES.INFO,
            orders: orders,
            pages: pages,
            employees: users,
            path: req.path
          });
        })
        .catch(function(error) {
          return res.render("info", {
            title: config.TITLES.INFO,
            error: error
          });
        });
    })
    .catch(function(error) {
      return res.render("info", { title: config.TITLES.INFO, error: error });
    });
});

app.get("/create-order", function(req, res) {
  const user = req.session[md5("user")];

  if (!user) {
    return res.redirect("/login");
  }

  res.render("create-order", {
    title: config.TITLES.CREATE_ORDER,
    urban: config.URBAN,
    subUrban: config.SUB_URBAN
  });
});

app.get("/tracking-order", function(req, res) {
  const _id = req.query._id;

  const user = req.session[md5("user")];

  if (!user) {
    return res.redirect("/login");
  }

  return Order.findById(_id)
    .then(function(order) {
      if (!order) {
        res.render("tracking-order", {
          title: config.TITLES.TRACKING_ORDER,
          error: `Can't find order ${_id}`
        });
      }

      User.findOne({ _id: order.assignedFor, role: User.roles.EMPLOYEE })
        .then(function(employee) {
          res.render("tracking-order", {
            title: config.TITLES.TRACKING_ORDER,
            order: order,
            time: moment(order.createdAt)
              .locale("vi")
              .format("DD MMM, YYYY HH:mm"),
            employee: employee
          });
        })
        .catch(function(error) {
          res.render("tracking-order", {
            title: config.TITLES.TRACKING_ORDER,
            error: "Somethings went wrong. Please try again."
          });
        });
    })
    .catch(function(error) {
      console.log(error);

      res.render("tracking-order", {
        title: config.TITLES.TRACKING_ORDER,
        error: "Somethings went wrong. Please try again."
      });
    });
});

app.get("/cart", function(req, res) {
  const page = req.query.page;

  const user = req.session[md5("user")];

  if (!user) {
    return res.redirect("/login");
  }

  const limit = Order.limit;

  let offset = 0;

  if (page) {
    offset = (page - 1) * limit;
  }

  return Order.paginate({ userId: user._id }, { offset: offset, limit: limit })
    .then(function(result) {
      const orders = result.docs;

      const pages = Math.ceil(result.total / limit);

      return res.render("cart", {
        title: config.TITLES.CART,
        orders: orders,
        pages: pages,
        path: req.path
      });
    })
    .catch(function(error) {
      return res.render("cart", { title: config.TITLES.CART, error: error });
    });
});

app.use("/api", [api, order]);

app.listen(config.PORT, function(error) {
  if (error) {
    console.log(error);

    process.exit(1);
  }

  console.log(`Server is running on port ${config.PORT}`);
});
