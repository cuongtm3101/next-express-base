const express = require("express");
const router = express.Router();
const { getAll, createOne, getOne, updateOne, deleteOne } = require("../controllers/section.controller")
const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");

router
  .route('/section')
  .get(getAll)
  .post(
    requireSignin,
    adminMiddleware,
    createOne)

router
  .route('/section/:slug')
  .get(getOne)
  .patch(
    requireSignin,
    adminMiddleware,
    updateOne)
  .delete(
    requireSignin,
    adminMiddleware,
    deleteOne)

module.exports = router;