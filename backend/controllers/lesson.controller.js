const Lesson = require("../models/lesson.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");

module.exports.getAll = factory.getAllBase(Lesson);
module.exports.createOne = factory.createOne(Lesson);
module.exports.getOne = factory.getOne(Lesson);
module.exports.updateOne = factory.updateOne(Lesson);
module.exports.deleteOne = factory.deleteOne(Lesson);