const express = require("express");
const router = express.Router();
const campgroundsController = require("../controllers/campgrounds");
const catchAsync = require("../utils/catchAsync");
const { isLoggedIn, isAuthor, validateCampgroud } = require("../middleware");

router
  .route("/")
  .get(catchAsync(campgroundsController.index))
  .post(
    isLoggedIn,
    validateCampgroud,
    catchAsync(campgroundsController.createNewCampground)
  );

router.get("/new", isLoggedIn, campgroundsController.renderNewForm);

router
  .route("/:id")
  .get(catchAsync(campgroundsController.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    validateCampgroud,
    catchAsync(campgroundsController.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundsController.deleteCampground)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgroundsController.renderEdit)
);

module.exports = router;
