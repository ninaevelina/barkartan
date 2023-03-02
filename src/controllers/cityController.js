const { sequelize } = require("../database/config");
const { bars } = require("../data/bar");
const { city } = require("../data/city");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");
const { QueryTypes } = require("sequelize");

exports.getBarByCityId = async (req, res) => {
  const cityId = req.params.city_id_fk;
  //const cityName = req.body.name;

  // const cityId = req.params.city_id_fk;

  const [results, metadata] = await sequelize.query(
    // `SELECT * FROM bar WHERE city_id_fk = $cityId`,

    //`SELECT * FROM bar WHERE city_id_fk = (SELECT id FROM city WHERE id = city.id);`,

    //`SELECT * FROM bar WHERE city_id_fk = ("SELECT id FROM city WHERE city.name = '$cityName'");`

    `SELECT * FROM bar WHERE city_id_fk = 2`
    /*{
      bind: { cityName: cityId },
    }*/
  );
  console.log(cityName);

  if (!results || results.length == 0) {
    throw new NotFoundError(
      "We could not find bars in the city you are looking for"
    );
  }

  console.log(results);

  return res.json(results);
};
