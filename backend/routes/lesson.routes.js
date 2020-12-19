const express = require('express');
const router = express.Router();
const { getAll, createOne, getOne, deleteOne, updateOne } = require('../controllers/lesson.controller')

const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");

router
  .route("/lesson")
  .get(getAll)
  .post(
    requireSignin,
    adminMiddleware,
    createOne)

router
  .route("/lesson/:slug")
  .get(getOne)
  .patch(
    requireSignin,
    adminMiddleware,
    updateOne
  )
  .delete(
    requireSignin,
    adminMiddleware,
    deleteOne)

module.exports = router;