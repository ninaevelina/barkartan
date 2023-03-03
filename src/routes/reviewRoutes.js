const express = require("express");
const router = express.Router();
const {
  getAllReviews,
  getReviewById,
} = require("../controllers/reviewController");

router.get("/", getAllReviews);
router.get("/:id", getReviewById);

module.exports = router;
