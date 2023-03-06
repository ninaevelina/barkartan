const { body } = require("express-validator");

exports.registerSchema = [
  body("username")
    .not()
    .isEmpty()
    .isLength({ min: 3, max: 50 })
    .withMessage(
      "You must provide a username that is at least 3 characters long"
    ),
  body("email").isEmail().withMessage("You must provide a valid email address"),
  body("password")
    .not()
    .isEmpty()
    .isLength({ min: 6 })
    .withMessage(
      "You must provide a password that is at least 6 characters long"
    ),
];

exports.loginSchema = [
  body("email").isEmail().withMessage("You must provide a valid email address"),
  body("password").not().isEmpty().withMessage("You must provide a password"),
];

exports.reviewSchema = [
  body("review_text")
    .not()
    .isEmpty()
    .isLength({ min: 2 })
    .withMessage("Your review must contain at least 2 characters"),
  body("rating")
    .not()
    .isEmpty()
    .isInt({ min: 1, max: 5 })
    .withMessage(
      "You must enter your review rating, please provide your rating between 1 and 5"
    ),
];
