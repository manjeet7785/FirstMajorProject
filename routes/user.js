const express = require("express")
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utilies/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middl");

const UserController = require("../controllers/ControllerReview")

router.get("/signup", UserController.SignupGetController)

router.post("/signup", wrapAsync(UserController.SignupPostController)
)

router.get("/login", UserController.loginGetController)

router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }), UserController.loginPostController
);


router.get("/logout", UserController.logoutController);


module.exports = router;