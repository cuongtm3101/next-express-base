const express = require("express");
const router = express.Router();
const {
  requireSignin,
  adminMiddleware,
} = require("../controllers/auth.controller");
const {
  create,
  list,
  read,
  remove,
  update
} = require("../controllers/category.controller");

// validators
const { runValidation } = require("../validators");
const { categoryCreateValidator } = require("../validators/category");


router.post(
  "/category",
  categoryCreateValidator,
  runValidation,
  requireSignin,
  adminMiddleware,
  create
);
router.get("/categories", list);
router.get("/category/:slug", read);
router.delete("/category/:slug", requireSignin, adminMiddleware, remove);
router.patch("/category/:slug", requireSignin, adminMiddleware, update)

module.exports = router;
