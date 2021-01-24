const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const catchAsync = require('../utils/catchAsync');
const Course = require("../models/course.model");

const signToken = _id => {
  return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const createSendToken = catchAsync(async (user, res) => {
  console.log(user._id);
  const token = signToken(user._id);
  cookieOptions = {
    signed: true,
    httpOnly: true,
  }
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;
  res.cookie("token", token, cookieOptions);
  user.password = undefined;
  res.redirect('/index');
  // const course = await Course.find();
  // res.render("index", { course, user })
});

exports.getSignup = function (req, res, next) {
  res.render('auth/signup');
};
module.exports.signup = catchAsync(async (req, res, next) => {
  const { username, email, password, ConfirmPassword } = req.body;
  if (password !== ConfirmPassword) {
    res.render('auth/signup', {
      message: "Password and password confirm is not correct !"
    });
    return;
  }
  const user = await User.findOne({ email });
  if (user) {
    res.render('auth/signup', {
      message: "Email is taken !"
    });
  };
  const newUser = await User.create({ username, email, password });
  createSendToken(newUser, res);
});

exports.getLogin = function (req, res, next) {
  res.render('auth/login');
};
module.exports.signin = catchAsync(async (req, res, next) => {
  // check if user exists
  const { email, password } = req.body;
  if (!email || !password) {
    res.render('auth/login', {
      message: "email or password can't empty !!!"
    });
    return;
  };
  const user = await User.findOne({ email });
  if (!user) {
    res.render('auth/login', {
      message: `Can Not Find This Email, You Can Sign Up by This Email ${email} !!! `
    });
    return;
  }
  if (!user.authenticate(password)) {
    res.render('auth/login', {
      message: `Password is not correct`
    });
    return;
  }
  createSendToken(user, res);
});

exports.checkUser = catchAsync(async (req, res, next) => {
  const { token } = req.signedCookies;
  if (!token) {
    next();
    return;
  }
  const { _id } = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById({ _id });
  req.user = user;
  next();
});

module.exports.signout = (req, res) => {
  res.clearCookie("token");
  res.render('auth/login', {
    message: "Signout success",
  })
};

exports.checkPermisstion = () => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.render('err/Error404')
    }
    return next();
  }
};

module.exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"], // added later
  // userProperty: "auth",
});

module.exports.authMiddleware = (req, res, next) => {
  const authUserId = req.user._id;
  User.findById({ _id: authUserId }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }
    req.profile = user;
    next();
  });
};

module.exports.adminMiddleware = (req, res, next) => {
  const adminUserId = req.user._id;
  User.findById({ _id: adminUserId }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found",
      });
    }

    if (user.role !== 1) {
      return res.status(400).json({
        error: "Admin resources. Access denied ",
      });
    }

    req.profile = user;
    next();
  });
};


