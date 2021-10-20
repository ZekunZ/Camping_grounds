const express = require("express");
const router = express.Router({ mergeParams: true }); // to merge the params to get /id

const catchAsync = require("../utils/catchAsync");

const Campground = require("../models/campground");
const Review = require("../models/review");
const reviewsController = require("../controllers/reviews");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

router.post(
  "/",
  isLoggedIn,
  validateReview,
  catchAsync(reviewsController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviewsController.deleteReview)
);

module.exports = router;
