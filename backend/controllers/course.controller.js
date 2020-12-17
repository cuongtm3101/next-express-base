const Course = require("../models/course.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getAllTours = catchAsync(async (req, res, next) => {
  const course = await Course.find();
  res.status(200).json({
    status: "OK",
    length: course.length,
    data: course
  })
});
exports.createCourse = catchAsync(async (req, res, next) => {
  const course = await Course.create(req.body);
  res.status(200).json({
    status: "OK",
    length: course.length,
    data: course
  })
});

exports.getCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const doc = await Course.findById(id);
  if (!doc) {
    next(new AppError(`Not Found A Document With ID : ${id}`, 404));
  }
  res.status(201).json({
    "status": "success",
    data: doc
  });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let doc = await Course.findById(id);
  if (!doc) {
    next(new AppError(`Not Found A Document With ID : ${id}`, 404));
  }

  doc = await Course.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  });
  res.status(201).json({
    "status": "success",
    data: {
      data: doc
    }
  });
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const document = await Course.findById(id);
  if (!document) {
    next(new AppError(`Not Found A Document With ID : ${id}`, 404));
  }
  await Course.findByIdAndDelete(id);
  res
    .status(201)
    .json(
      {
        "status": "success",
        "message": `Delete success document with ${id}`
      }
    );
})