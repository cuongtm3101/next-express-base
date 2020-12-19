const catchAsync = require("../utils/catchAsync");
const AppError = require('./../utils/appError');

module.exports.getAllBase = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.find();
  res.status(201).json({
    status: "success",
    data: {
      data: doc
    }
  });
});

module.exports.createOne = Model => catchAsync(async (req, res, next) => {
  const doc = await Model.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      data: doc
    }
  });
});

module.exports.getOne = Model => catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const doc = await Model.findOne({ slug });
  if (!doc) {
    next(new AppError(`Not Found A Document With Slug : ${slug}`, 404));
  }
  res.status(201).json({
    "status": "success",
    "results": doc.length,
    data: {
      data: doc
    }
  });
});

module.exports.updateOne = Model => catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const doc = await Model.findOneAndUpdate({ slug }, req.body, {
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

module.exports.deleteOne = Model => catchAsync(async (req, res, next) => {
  const { slug } = req.params;
  const document = await Model.findOne({ slug });
  if (!document) {
    next(new AppError(`Not Found A Document With Slug : ${slug}`, 404));
  }
  await Model.findOneAndDelete({ slug });
  res
    .status(201)
    .json(
      {
        "status": "success",
        "message": `Delete success document with Slug ${slug}`
      }
    );
});