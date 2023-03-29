const express = require("express");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const router = express.Router();
const {
  getAllReviews,
  deleteReview,
  createNewReview,
  getReviewsByBarId,
  updateReviewById,
} = require("../controllers/reviewController");
const { validate } = require("../middleware/validation/validationMiddleware");
const { reviewSchema } = require("../middleware/validation/validationSchemas");

router.get("/", getAllReviews);
router.get("/:id", getReviewsByBarId);
router.delete("/:reviewId", isAuthenticated, deleteReview);
router.post("/:barId", isAuthenticated, createNewReview);
router.put(
  "/:reviewId",
  validate(reviewSchema),
  isAuthenticated,
  updateReviewById
);

module.exports = router;
