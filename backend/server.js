const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const AppError = require("./utils/appError");
const path = require("path");

// start test API upload IMG, MP4 
var multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})
var upload = multer({ storage: storage })
// end test API upload IMG, MP4

const db = require('./helpers/dbConnect');

require("dotenv").config();

const globalErrorHandler = require('./controllers/err.controller');

// bring routes
const blogRoutes = require("./routes/blog.routes");
const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/course.routes");
const userRoutes = require("./routes/user.routes");
const categoryRoutes = require("./routes/category.routes");
const sectionRoutes = require("./routes/section.routes");
const lessonRoutes = require("./routes/lesson.routes");
const orderRoutes = require("./routes/order.routes");

// app
const app = express();

// database
db.Connect();

// middleware
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))

// cors
if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: `${process.env.CLIENT_URL}`,
    })
  );
}

// routes middleware
app.use("/api", blogRoutes);
app.use("/api", authRoutes);
app.use('/api', courseRoutes)
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", sectionRoutes);
app.use("/api", lessonRoutes);
app.use("/api", orderRoutes);

const imageFilter = function (req, file, cb, next) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = 'Only image files are allowed!';
    console.log("loi");
    return cb(new Error('Only image files are allowed!'), false);
  }
  cb(null, true);
  next();
};

// start API Upload IMG MP4
app.post("/api/upload", imageFilter, upload.single('avatar'), imageFilter, function (req, res, next) {
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  let imgURL = file.path.split("\\").filter((item) => item != "public").join('/');
  return res.json({
    imgURL
  })
})
// end API Upload IMG MP4


// start test payment VNP API
const { OnePayDomestic } = require('vn-payments');
const { OnePayInternational } = require('vn-payments');
const { VNPay } = require('vn-payments');
const { SohaPay } = require('vn-payments');
const { NganLuong } = require('vn-payments');

const onepayIntl = new OnePayInternational({
  paymentGateway: 'https://mtf.onepay.vn/vpcpay/vpcpay.op',
  merchant: 'TESTONEPAY',
  accessCode: '6BEB2546',
  secureSecret: '6D0870CDE5F24F34F3915FB0045120DB',
});

app.post('/payment/checkout', (req, res) => {
  const params = Object.assign({}, req.body);
  // construct checkout payload from form data and app's defaults
  const checkoutData = {
    amount: parseInt(params.amount, 10),
    customerId: params.email,
    currency: 'VND',
    /*...*/
  };
  // buildCheckoutUrl is async operation and will return a Promise
  onepayIntl
    .buildCheckoutUrl(checkoutData)
    .then(checkoutUrl => {
      res.writeHead(301, { Location: checkoutUrl.href });
      res.end();
    })
    .catch(err => {
      res.send(err);
    });
});

// end test payment VNP API

app.all("*", (req, res, next) => {
  next(new AppError(`Can't not found this path : ${req.originalUrl} on server`, 404));
});

app.use(globalErrorHandler);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${8000}`);
});
