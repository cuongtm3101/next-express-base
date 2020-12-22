const express = require("express");
const router = express.Router();
const sectionRoutes = require('./section.routes');

const {
  getAllCourse,
  createCourse,
  getCourse,
  updateCourse,
  deleteCourse
} = require('../controllers/course.controller');
const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");

router.use("/course/:slug", sectionRoutes)

router
  .route("/course")
  .get(getAllCourse)
  .post(
    requireSignin,
    adminMiddleware,
    createCourse)

router
  .route("/course/:slug")
  .get(getCourse)
  .patch(
    requireSignin,
    adminMiddleware,
    updateCourse
  )
  .delete(
    requireSignin,
    adminMiddleware,
    deleteCourse)



module.exports = router;