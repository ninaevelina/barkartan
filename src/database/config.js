const { Sequelize } = require("sequelize");
const path = require("path");

const sequelize = new Sequelize("barsDb", "", "", {
  dialect: "sqlite",
  storage: path.join(__dirname, "barsDb.sqlite"),
});

module.exports = {
  sequelize,
};
