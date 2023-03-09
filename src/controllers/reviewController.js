const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");
const { QueryTypes } = require("sequelize");
const {
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} = require("../utils/errors");

// get all reviews

exports.getAllReviews = async (req, res) => {
  const [review, metadata] = await sequelize.query(`
    SELECT * FROM review
    `);

  return res.json(review);
};

// get review by id

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

  // const reviewId = req.params.id;

  // const [results] = await sequelize.query(
  //   `
  //   SELECT * FROM review r
  //   WHERE id = $reviewId`,
  //   {
  //     bind: { reviewId: reviewId },
  //   }
  // );
};

// delete review by id

exports.deleteReview = async (req, res) => {
  const reviewId = req.params.reviewId;
  const userId = req.user.userId;
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
    throw new UnauthorizedError("No permission to delete this review");
  }
};

/******************************* test ***************************************************************** */
// create review

// http://localhost:3000/api/v1/bar/1/review

exports.createReview = async (req, res) => {
  const userId = req.user.id;
  const barId = req.params.id || req.body.id; // bar-id in body obs test
  const { review_text, rating } = req.body;

  if (req.user.role !== userRoles.ADMIN) {
    const [newReviewId] = await sequelize.query(
      `
    INSERT INTO review (review_text, bar_id_fk, user_id_fk, rating)
    VALUES ($review_text, $bar_id_fk, $user_id_fk, $rating);
    `,
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
        `${req.protocol}://${req.headers.host}/api/v1/bar/${barId}/review/${newReviewId.reviewId}`
      )
      .sendStatus(201);
  }
};

exports.createNewReview = async (req, res) => {
  const { review_text, rating } = req.body; // bodyn
  const barId = req.params.barId; // path varible / dynamiskt värde
  const userId = req.user.userId; // för att du är inloggad

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

// update review

// funkar!

exports.updateReviewById = async (req, res) => {
  const { review_text, rating } = req.body;
  //const barId = req.params.barId;
  //const reviewId = req.params.review.id;
  const reviewId = req.params.reviewId;
  const userId = req.user.userId;
  const userRole = req.user.role;

  if (!review_text || !rating) {
    throw new BadRequestError(
      "You haven't entered any updated values for the review, please try again"
    );
  }
  /*
  const [bar] = await sequelize.query(
    `
    SELECT * FROM bar
    where id = $barId
    `,
    {
      bind: {
        barId: barId,
      },
    }
  );*/

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
    throw new UnauthorizedError("this ain't your review bruh");
  }
};

// get all reviews by bar_id
