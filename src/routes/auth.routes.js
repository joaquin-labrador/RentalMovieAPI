const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {
  isEmail,
  isSecurePassword,
  repasswordMatch,
} = require("../middleware/auth.middleware");

router.post(
  "/signup",
  isEmail,
  isSecurePassword,
  repasswordMatch,
  authController.singUp
);
router.post("/login", authController.login);
router.get("/logout", authController.logout);

module.exports = router;
