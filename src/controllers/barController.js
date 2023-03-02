const { sequelize } = require("../database/config");
const { bars } = require("../data/bar");
const { user } = require("../data/user");
const { userRoles } = require("../constants/users");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");
const { QueryTypes } = require("sequelize");

//get all bars
exports.getAllBars = async (req, res) => {
  try {
    const [bars, metadata] = await sequelize.query(`SELECT * FROM bar`);

    console.log(bars);

    return res.json(bars);
  } catch (error) {
    if (!bars)
      throw new NotFoundError("We cannot find the bars you're looking for");
    console.error(error);
  }
};

//get bar by id
exports.getBarById = async (req, res) => {};

//get bar by city_id
exports.getBarByCityId = async (req, res) => {};

//create new bar
exports.createNewBar = async (req, res) => {};

//delete bar
exports.deleteBarById = async (req, res) => {};
