const Course = require("../models/course.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");

exports.getAllCourse = catchAsync(async (req, res, next) => {
  const course = await Course.find();
  res.status(200).json({
    status: "OK",
    length: course.length,
    data: course
  })
});
exports.createCourse = factory.createOne(Course);

exports.getCourse = factory.getOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);