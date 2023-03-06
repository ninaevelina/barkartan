const express = require("express");
const { isAuthenticated } = require("../middleware/authenticationMiddleware");
const router = express.Router();
const {
  getAllReviews,
  getReviewById,
  deleteReview,
  createReview,
} = require("../controllers/reviewController");
const { validate } = require("../middleware/validation/validationMiddleware");
const { reviewSchema } = require("../middleware/validation/validationSchemas");

router.get("/", getAllReviews);
router.get("/:id", getReviewById);
router.delete("/:reviewId", isAuthenticated, deleteReview);
router.post("/:barId", validate(reviewSchema), isAuthenticated, createReview);

module.exports = router;
