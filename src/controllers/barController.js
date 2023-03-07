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
exports.getBarById = async (req, res) => {
  const barId = req.params.id;
  const [results, metadata] = await sequelize.query(
    `SELECT * FROM bar WHERE id = $barId`,
    {
      bind: { barId: barId },
    }
  );

  if (!results || results.length == 0) {
    throw new NotFoundError("We could not find the bar you are looking for");
  }

  console.log(results);

  return res.json(results);
};

/************ create new bar **************/
exports.createNewBar = async (req, res) => {
  const { name, address, description, cityId, phone, website, hours } =
    req.body;
  // const userId = req.user.id;

  const user_id_fk = req.user.id;

  const [newBarId] = await sequelize.query(
    "INSERT INTO bar (name, user_id_fk, address,description, city_id_fk, phone, website, hours) VALUES ($name, $user_id_fk, $address, $description, $cityId, $phone, $website, $hours)",
    {
      bind: {
        name: name,
        user_id_fk: user_id_fk,
        address: address,
        description: description,
        cityId: cityId,
        phone: phone,
        website: website,
        hours: hours,
      },
      type: QueryTypes.INSERT,
    }
  );

  // Request response
  return res
    .setHeader(
      "Location",
      `${req.protocol}://${req.headers.host}/api/v1/bar/${newBarId.barId}`
    )
    .status(201)
    .json({
      message: "Registration succeeded.",
    });
};

//delete bar
exports.deleteBarById = async (req, res) => {
  const barId = req.params.id;
  const [results, metadata] = await sequelize.query(
    `SELECT * FROM bar WHERE id = $barId`,
    {
      bind: { barId: barId },
    }
  );

  if (!results || results.length == 0) {
    throw new NotFoundError("We could not find the bar you are looking for");
  }
  //admin+userid auth

  if (req.user.id == bars.user_id_fk || req.user.role == userRoles.ADMIN) {
    await sequelize.query(
      `
    DELETE FROM bar WHERE id = $barId`,
      {
        bind: {
          barId: barId,
        },
        type: QueryTypes.DELETE,
      }
    );
    return res.sendStatus(204);
  } else {
    throw new UnauthorizedError("No permission to delete this bar");
  }
};
