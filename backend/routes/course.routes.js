const express = require("express");
const router = express.Router();
const {
  getAllTours,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/course.controller');

router
  .route("/course")
  .get(getAllTours)
  .post(createCourse)

router
  .route("/course/:id")
  .get(getCourse)
  .patch(updateCourse)
  .delete(deleteCourse)



module.exports = router;