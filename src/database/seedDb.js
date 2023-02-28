const { bars } = require("../data/bars");
const { sequelize } = require("./config");

const seedBarsDb = async () => {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS bar;`);

    // Create bars table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS bar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            description TEXT NOT NULL,
            city TEXT NOT NULL,
            phone INTEGER,
            website TEXT,
            hours TEXT,
            reviews TEXT,
            rating INTEGER,
        );
        `);

    let barInsertQuery =
      "INSERT INTO(id, name, adress, description, city, phone, website, hours, reviews, rating)VALUES";

    let barInsertQueryVariables = [];
  } catch (error) {}
};
