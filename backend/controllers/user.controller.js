const User = require("../models/user.model");
module.exports.read = (req, res, next) => {
  req.profile.hashed_password = undefined;
  return res.json(req.profile);
};
