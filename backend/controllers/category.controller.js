const Category = require("../models/category.model");
const slug = require("slugify");
const { default: slugify } = require("slugify");
const { errorHandler } = require("../helpers/dbErrorHandler");

module.exports.create = (req, res) => {
  const { name } = req.body;

  const slug = slugify(name).toLowerCase();

  const category = new Category({ name, slug });
  category.save((err, data) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err),
      });
    }
    res.json(data);
  });
};
