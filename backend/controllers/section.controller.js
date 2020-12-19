const Section = require("../models/section.model");
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require("./handleFactory");

module.exports.getAll = factory.getAllBase(Section);
module.exports.createOne = factory.createOne(Section);
module.exports.getOne = factory.getOne(Section);
module.exports.updateOne = factory.updateOne(Section);
module.exports.deleteOne = factory.deleteOne(Section);