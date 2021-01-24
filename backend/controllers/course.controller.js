const Course = require("../models/course.model");
const Section = require("../models/section.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");
const apiFeatures = require('../utils/apiFeatures');
const Lession = require('../models/lesson.model')

function sortObject(o) {
  var sorted = {},
    key, a = [];

  for (key in o) {
    if (o.hasOwnProperty(key)) {
      a.push(key);
    }
  }

  a.sort();

  for (key = 0; key < a.length; key++) {
    sorted[a[key]] = o[a[key]];
  }
  return sorted;
}

exports.getAllCourse = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.slug) {
    const temp = { slug: req.params.slug };
    const section = await Course.findOne(temp);
    filter = { sectionId: section._id };
  }
  const futures = new apiFeatures(Course.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await futures.query;
  if (!doc) {
    next(new AppError(`Not Found A Document`, 404));
  }

  res.render('index', {
    course: doc
  });

  // res.status(200).json({
  //   "status": "success",
  //   "results": doc.length,
  //   data: {
  //     data: doc
  //   }
  // });
});

exports.createCourse = factory.createOne(Course);

exports.getCourse = factory.getOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);

exports.getDetailAndPayment = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const course = await Course.findOne({ slug });
  if (!course) {
    next(new AppError(`Not Found A Document With Slug : ${slug}`, 404));
  }
  let lesson = [];
  course.sectionId.forEach(element => {
    lesson.push(element.lessonId)
  });

  const { user } = req;

  res.render('courses/course-detail', {
    title: course.courseName,
    course,
    user
  })
});

exports.postCheckOut = catchAsync(async (req, res, next) => {

  if (!req.cookies.token) {
    res.redirect('/user/login');
  }

  var ipAddr = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var dateFormat = require('dateformat');
  var date = new Date();

  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;
  var vnpUrl = process.env.vnp_Url;
  var returnUrl = process.env.vnp_ReturnUrl;

  var createDate = dateFormat(date, 'yyyymmddHHmmss');
  var orderId = dateFormat(date, 'HHmmss');

  var amount = parseFloat(req.body.amount);
  var bankCode = req.body.bankCode;
  let orderInfo = req.body.description;

  var currCode = 'VND';
  var vnp_Params = {};

  vnp_Params['vnp_Version'] = '2';
  vnp_Params['vnp_Command'] = 'pay';
  vnp_Params['vnp_TmnCode'] = tmnCode;

  vnp_Params['vnp_Locale'] = "vn";
  vnp_Params['vnp_CurrCode'] = currCode;
  vnp_Params['vnp_TxnRef'] = orderId;
  vnp_Params['vnp_OrderInfo'] = orderInfo;
  vnp_Params['vnp_OrderType'] = "billpayment";
  vnp_Params['vnp_Amount'] = amount * 100000;
  vnp_Params['vnp_ReturnUrl'] = returnUrl;
  vnp_Params['vnp_IpAddr'] = ipAddr;
  vnp_Params['vnp_CreateDate'] = createDate;
  if (bankCode !== null && bankCode !== '') {
    vnp_Params['vnp_BankCode'] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var querystring = require('qs');
  var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

  var sha256 = require('sha256');

  var secureHash = sha256(signData);

  vnp_Params['vnp_SecureHashType'] = 'SHA256';
  vnp_Params['vnp_SecureHash'] = secureHash;
  vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: true });

  res.redirect(vnpUrl);
});

exports.returnPaymentLink = catchAsync(async (req, res, next) => {
  var vnp_Params = req.query;

  var secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];

  vnp_Params = sortObject(vnp_Params);

  var tmnCode = process.env.vnp_TmnCode;
  var secretKey = process.env.vnp_HashSecret;

  var querystring = require('qs');
  var signData = secretKey + querystring.stringify(vnp_Params, { encode: false });

  var sha256 = require('sha256');

  var checkSum = sha256(signData);

  if (secureHash === checkSum) {
    //Kiem tra xem du lieu trong db co hop le hay khong va thong bao ket qua
    res.render('success', { code: vnp_Params['vnp_ResponseCode'] })
  } else {
    res.render('success', { code: '97' })
  }
})