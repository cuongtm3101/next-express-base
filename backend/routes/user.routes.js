const express = require("express");
const router = express.Router();
const { read } = require("../controllers/user.controller");
const {
  requireSignin,
  authMiddleware,
  adminMiddleware,
} = require("../controllers/auth.controller");

router.get("/profile", requireSignin, authMiddleware, read);

module.exports = router;
