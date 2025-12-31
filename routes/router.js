const express = require("express")
const router = express.Router({ mergeParams: true });

const List = require("../models/listing.js")
const Review = require("../models/reviews.js")
const wrapAsync = require("../utilies/wrapAsync.js")
const ExpressError = require("../utilies/ExpressError.js");
const { isLoggedIn } = require("../middl.js");

const reviewsController = require("../controllers/ControllerReview.js")

router.post("/", isLoggedIn, wrapAsync(reviewsController.CreateReviews));

router.delete("/:reviewId", isLoggedIn,
  wrapAsync(reviewsController.DeleteController)
);

module.exports = router;