const express = require("express");
const router = express.Router();
const {
  getAllCourse,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/course.controller');

router
  .route("/course")
  .get(getAllCourse)
  .post(createCourse)

router
  .route("/course/:slug")
  .get(getCourse)
  .patch(updateCourse)
  .delete(deleteCourse)



module.exports = router;