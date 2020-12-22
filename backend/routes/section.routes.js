const express = require("express");
const router = express.Router({ mergeParams: true });

const lessonRoutes = require('./lesson.routes');

const { createOne, getOne, updateOne, deleteOne, getAllSectionByCourse } = require("../controllers/section.controller")
const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");

// you can nest routers by attaching them as middleware:
router.use("/section/:slug", lessonRoutes)

router
  .route('/section')
  .get(getAllSectionByCourse)
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