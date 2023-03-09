const { sequelize } = require("./config");
const { bars } = require("../data/bars");
const { cities } = require("../data/cities");
const { reviews } = require("../data/reviews");
const { users } = require("../data/users");
const bcrypt = require("bcrypt");

sequelize.query("PRAGMA foreign_keys = ON", { raw: true });

const seedBarDb = async () => {
  try {
    await sequelize.query(`DROP TABLE IF EXISTS review;`);
    await sequelize.query(`DROP TABLE IF EXISTS bar;`);
    await sequelize.query(`DROP TABLE IF EXISTS city;`);
    await sequelize.query(`DROP TABLE IF EXISTS user;`);

    // Create bars table
    await sequelize.query(`
        CREATE TABLE IF NOT EXISTS bar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id_fk INTEGER NOT NULL,
            name TEXT NOT NULL,
            address TEXT NOT NULL,
            description TEXT NOT NULL,
            city_id_fk INTEGER NOT NULL,
            phone TEXT,
            website TEXT,
            hours TEXT,
            FOREIGN KEY(user_id_fk) REFERENCES user(id),
            FOREIGN KEY(city_id_fk) REFERENCES city(id)
        );
    `);

    //Create city table
    await sequelize.query(`
          CREATE TABLE IF NOT EXISTS city (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL
          );
    `);
    // create user table
    await sequelize.query(`
            CREATE TABLE IF NOT EXISTS user (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              username TEXT,
              password TEXT,
              email TEXT,
              is_admin BOOLEAN NOT NULL DEFAULT 0
            );
    `);

    // create review table
    await sequelize.query(`
       CREATE TABLE IF NOT EXISTS review (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        review_text TEXT NOT NULL,
        bar_id_fk INTEGER,
        user_id_fk INTEGER,
        rating INTEGER,
        FOREIGN KEY(bar_id_fk) REFERENCES bar(id),
        FOREIGN KEY(user_id_fk) REFERENCES user(id)
       );
    `);

    //user loop

    let userInsertQuery = `INSERT INTO user (username, password, email, is_admin) VALUES `;

    for (let i = 0; i < users.length; i++) {
      let username = users[i].username;
      let password = users[i].password;
      let email = users[i].email;
      let is_admin = users[i].is_admin;

      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);

      let values = `("${username}", "${hashedpassword}", "${email}", "${is_admin}")`;
      userInsertQuery += values;
      if (i < users.length - 1) userInsertQuery += ", ";
    }

    userInsertQuery += ";";

    await sequelize.query(userInsertQuery);

    // city loop

    let cityInsertQuery = `INSERT INTO city (name) VALUES `;

    for (let i = 0; i < cities.length; i++) {
      let name = cities[i].name;

      let values = `("${name}")`;
      cityInsertQuery += values;
      if (i < cities.length - 1) cityInsertQuery += ", ";
    }

    cityInsertQuery += ";";

    await sequelize.query(cityInsertQuery);

    // bar loop

    let barInsertQuery = `INSERT INTO bar (user_id_fk, name, address, description, city_id_fk, phone, website, hours) VALUES `;

    for (let i = 0; i < bars.length; i++) {
      let user_id_fk = bars[i].user_id_fk;
      let name = bars[i].name;
      let address = bars[i].address;
      let description = bars[i].description;
      let city_id_fk = bars[i].city;
      let phone = bars[i].phone;
      let website = bars[i].website;
      let hours = bars[i].hours;

      let values = `("${user_id_fk}", "${name}", "${address}", "${description}", "${city_id_fk}", "${phone}", "${website}", "${hours}")`;
      barInsertQuery += values;
      if (i < bars.length - 1) barInsertQuery += ", ";
    }

    barInsertQuery += ";";

    await sequelize.query(barInsertQuery);

    // review loop

    let reviewInsertQuery = `INSERT INTO review (review_text, rating, bar_id_fk, user_id_fk) VALUES `;

    for (let i = 0; i < reviews.length; i++) {
      let review_text = reviews[i].review_text;
      let rating = reviews[i].rating;
      let bar_id_fk = reviews[i].bar_id_fk;
      let user_id_fk = reviews[i].user_id_fk;

      let values = `("${review_text}", "${rating}", ${bar_id_fk},  ${user_id_fk})`;
      reviewInsertQuery += values;
      if (i < reviews.length - 1) reviewInsertQuery += ", ";
    }

    reviewInsertQuery += ";";

    await sequelize.query(reviewInsertQuery);
  } catch (error) {
    console.error(error);
  } finally {
    process.exit(0);
  }
};

seedBarDb();
