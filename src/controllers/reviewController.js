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

// delete review by id

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.id;
  const [review, metadata] = await sequelize.query(
    `
  
  SELECT * FROM review r
  WHERE id = $reviewId`,

    {
      bind: { reviewId: reviewId },
      type: QueryTypes.SELECT,
    }
  );

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  //admin+userid auth

  if (req.user.id == review.user_id_fk || req.user.role == userRoles.ADMIN) {
    await sequelize.query(
      `
    DELETE FROM review r
    WHERE id = $reviewId`,
      {
        bind: {
          reviewId: reviewId,
        },
        type: QueryTypes.DELETE,
      }
    );
    return res.sendStatus(204);
  } else {
    throw new UnauthorizedError("No permission to delete this review");
  }
};

// create review

exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const barId = req.params.id;
  const { review_text, rating } = req.body;

  // var + await s.query
  //bind + type, qtype
  // return res w. header+status
};

// get all reviews by bar_id
