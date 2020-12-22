const Lesson = require("../models/lesson.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");
const Section = require("../models/section.model");
const apiFeatures = require('../utils/apiFeatures');

exports.createOnLesson = catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  if (slug) {
    const section = await Section.findOne({ slug });
    const id = section._id;
    if (!req.body.sectionId) req.body.sectionId = id
  }
  next();
});

module.exports.getAll = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.slug) {
    const temp = { slug: req.params.slug };
    const section = await Section.findOne(temp);
    filter = { sectionId: section._id };
  }
  const futures = new apiFeatures(Lesson.find(filter), req.query)
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
module.exports.createOne = factory.createOne(Lesson);
module.exports.getOne = factory.getOne(Lesson);
module.exports.updateOne = factory.updateOne(Lesson);
module.exports.deleteOne = factory.deleteOne(Lesson);