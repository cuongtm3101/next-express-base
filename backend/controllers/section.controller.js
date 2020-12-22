const Section = require("../models/section.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");
const Course = require("../models/course.model");
const apiFeatures = require('../utils/apiFeatures');


module.exports.getAllSectionByCourse = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.slug) {
    const temp = { slug: req.params.slug };
    const course = await Course.findOne(temp);
    filter = { courseId: course._id };
    console.log(course._id);
  }
  const futures = new apiFeatures(Section.find(filter), req.query)
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
})

module.exports.createOne = factory.createOne(Section);
module.exports.getOne = factory.getOne(Section);
module.exports.updateOne = factory.updateOne(Section);
module.exports.deleteOne = factory.deleteOne(Section);