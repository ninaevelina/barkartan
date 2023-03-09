const { sequelize } = require("../database/config");
const { bars } = require("../data/bars");
const { city } = require("../data/cities");
const { NotFoundError } = require("../utils/errors");

exports.getBarByCityId = async (req, res) => {
  const cityId = req.params.id;

  const [results, metadata] = await sequelize.query(
    `SELECT * FROM bar WHERE city_id_fk = $cityId`,
    {
      bind: { cityId: cityId },
    }
  );

  if (!results || results.length == 0) {
    throw new NotFoundError("We could not find any bars in your city");
  }
  return res.json(results);
};

exports.addNewCity = async (req, res) => {
  const { name } = req.body;
  await sequelize.query("INSERT INTO city (name) VALUES ($name)", {
    bind: {
      name: name,
    },
  });

  return res.status(201).json({
    message: "City added.",
  });
};
