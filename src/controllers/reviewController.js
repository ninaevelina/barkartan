const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");

// get all reviews

exports.getAllReviews = async (req, res) => {
  const [review, metadata] = await sequelize.query(`
    SELECT * FROM review
    `);

  return res.json(review);
};

// get review by id

exports.getReviewById = async (req, res) => {
  const reviewId = req.params.id;

  const [results] = await sequelize.query(
    `
    SELECT * FROM review r
    WHERE id = $reviewId`,
    {
      bind: { reviewId: reviewId },
    }
  );

  if (!results || results.length == 0) {
    throw new NotFoundError("We couldn't find the requested review");
  }

  return res.json(results);
};

// delete review

exports.deleteReview = async (req, res) => {};

// create review

// get all reviews by bar_id
