const express = require("express");
const router = express.Router();
const { getAll, createOne, getOne, updateOne, deleteOne } = require('../controllers/order.controller');

router
  .route("/order")
  .get(getAll)
  .post(createOne);

router
  .route("/order/:slug")
  .get(getOne)
  .patch(updateOne)
  .delete(deleteOne)

module.exports = router;