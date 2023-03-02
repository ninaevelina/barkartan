const { sequelize } = require("../database/config");
const { userRoles } = require("../constants/users");
const { QueryTypes } = require("sequelize");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");

// get all reviews

exports.getAllReviews = async (req, res) => {};

// get review by id

// delete review by id

// get all reviews by bar_id
