const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");
const { QueryTypes } = require("sequelize");
const {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errors");

exports.getAllReviews = async (req, res) => {
  const limit = req.query?.limit || 10;
  const offset = req.query?.offset || 0;
  const [review, metadata] = await sequelize.query(
    `
    SELECT * FROM review LIMIT $limit OFFSET $offset
    `,
    {
      bind: { limit: limit, offset: offset },
    }
  );

  if (review.length < 0) {
    throw new NotFoundError("Sorry, we can't find any reviews!");
  }

  return res.json(review);
};

exports.getReviewsByBarId = async (req, res) => {
  const barId = req.params.id;
  console.log(barId);

  const [results] = await sequelize.query(
    `SELECT * FROM review WHERE bar_id_fk =  $barId;`,
    {
      bind: { barId: barId },
    }
  );

  if (!results || results.length == 0) {
    throw new NotFoundError(
      "We couldn't find the any reviews on the selected bar"
    );
  }

  return res.json(results);
};

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.userId;
  const [review, metadata] = await sequelize.query(
    `SELECT * FROM review r WHERE id = $reviewId`,
    {
      bind: { reviewId: reviewId },
      type: QueryTypes.SELECT,
    }
  );

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  if (req.user.id == review.user_id_fk || req.user.role == userRoles.ADMIN) {
    await sequelize.query(
      `
    DELETE FROM review r
    WHERE review.id = $reviewId`,
      {
        bind: {
          reviewId: reviewId,
        },
        type: QueryTypes.DELETE,
      }
    );
    return res.sendStatus(204);
  } else {
    throw new UnauthorizedError("You are not authorized to delete this review");
  }
};

exports.createNewReview = async (req, res) => {
  const { review_text, rating } = req.body;
  const barId = req.params.barId;
  const userId = req.user.userId;
  const [bar] = await sequelize.query(
    `
  SELECT * FROM bar
  WHERE id = $barId
  `,
    {
      bind: {
        barId: barId,
      },
    }
  );

  if (req.user.id !== bar[0].user_id_fk) {
    const [newReviewId] = await sequelize.query(
      `
  INSERT INTO review (review_text, bar_id_fk, user_id_fk, rating) 
  VALUES ($review_text, $bar_id_fk, $user_id_fk, $rating);`,
      {
        bind: {
          review_text: review_text,
          bar_id_fk: barId,
          user_id_fk: userId,
          rating: rating,
        },
        type: QueryTypes.INSERT,
      }
    );

    return res
      .setHeader(
        "Location",
        `${req.protocol}://${req.headers.host}/api/v1/review/${newReviewId.reviewId}`
      )
      .status(201)
      .json({
        message: "Review created!",
      });
  } else {
    throw new BadRequestError("opsi");
  }
};

exports.updateReviewById = async (req, res) => {
  const { review_text, rating } = req.body;

  const reviewId = req.params.reviewId;
  const userId = req.user.userId;
  const userRole = req.user.role;

  if (!review_text || !rating) {
    throw new BadRequestError("You have to enter values for each field.");
  }

  const review = await sequelize.query(
    `
    SELECT * FROM review
    WHERE review.id = $reviewId
    `,
    {
      bind: { reviewId: reviewId },
      type: QueryTypes.SELECT,
    }
  );

  if (!review) throw new UnauthorizedError("Review does not exist");

  if (userId == review[0].user_id_fk || userRole == userRoles.ADMIN) {
    const [updatedReview] = await sequelize.query(
      `
    UPDATE review SET review_text = $review_text, rating = $rating
    WHERE review.id = $reviewId
    RETURNING *;
    `,
      {
        bind: {
          review_text: review_text,
          rating: rating,
          reviewId: reviewId,
        },
        type: QueryTypes.UPDATE,
      }
    );
    return res.json(updatedReview);
  } else {
    throw new UnauthorizedError(
      "You're trying to update a review created by another user!"
    );
  }
};
/*
exports.deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.userId;
  const [review, metadata] = await sequelize.query(
    `SELECT * FROM review r WHERE id = $reviewId`,
    {
      bind: { reviewId: reviewId },
      type: QueryTypes.SELECT,
    }
  );

  if (!review) {
    throw new NotFoundError("Review not found");
  }

  if (userId == review.user_id_fk || req.user.is_admin == 1) {
    await sequelize.query(`DELETE FROM review r WHERE review.id = $reviewId`, {
      bind: {
        reviewId: reviewId,
      },
      type: QueryTypes.DELETE,
    });
    return res.sendStatus(204);
  } else {
    throw new UnauthorizedError("You are not authorized to delete this review");
  }
};*/
