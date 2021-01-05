const Course = require("../models/course.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");
const apiFeatures = require('../utils/apiFeatures');

const Session = require('../models/session.model')


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

  res.status(200).json({
    "status": "success",
    "results": doc.length,
    data: {
      data: doc
    }
  });
});

exports.createCourse = factory.createOne(Course);

exports.getCourse = factory.getOne(Course);

exports.updateCourse = factory.updateOne(Course);

exports.deleteCourse = factory.deleteOne(Course);