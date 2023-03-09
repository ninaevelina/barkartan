const { sequelize } = require("../database/config");
const { bars, bar } = require("../data/bar");
const { user } = require("../data/user");
const { userRoles } = require("../constants/users");
const { UnauthorizedError, NotFoundError } = require("../utils/errors");
const { QueryTypes } = require("sequelize");
const jwt = require("jsonwebtoken");

//get all bars
exports.getAllBars = async (req, res) => {
  try {
    const limit = req.query?.limit || 10;
    const offset = req.query?.offset || 0;
    const [bars, metadata] = await sequelize.query(
      `SELECT * FROM bar ORDER BY name ASC LIMIT $limit OFFSET $offset`,
      {
        bind: { limit: limit, offset: offset },
      }
    );

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

  console.log("userId", req.user.userId);

  const userId = req.user.userId;

  const [newBarId] = await sequelize.query(
    "INSERT INTO bar (name, user_id_fk, address,description, city_id_fk, phone, website, hours) VALUES ($name, $userId, $address, $description, $cityId, $phone, $website, $hours)",
    {
      bind: {
        name: name,
        userId: userId,
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

  console.log(cityId);

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

//updateBar

exports.updateBarById = async (req, res) => {
  const barId = req.params.id;
  const { name, address, description, cityId, phone, website, hours } =
    req.body;

  const [results, metadata] = await sequelize.query(
    `SELECT * FROM bar WHERE id = $barId`,
    {
      bind: { barId: barId },
      type: QueryTypes.SELECT,
    }
  );

  if (req.user.userId != results.user_id_fk || req.user.is_admin != 1) {
    throw new UnauthorizedError("You are not authorized to update this bar");
  }

  console.log(barId, results);
  if (!results || results.length == 0) {
    throw new NotFoundError("We could not find the bar you are looking for");
  }
  console.log(
    "results.user_id_fk",
    results.user_id_fk,
    "req.user.userId",
    req.user.userId
  );

  await sequelize.query(
    `UPDATE bar SET name = $name, user_id_fk = $user_id_fk, address = $address,description = $description, city_id_fk = $cityId, phone = $phone, website = $website, hours = $hours WHERE id = $barId RETURNING *;`,
    {
      bind: {
        name: name,
        user_id_fk: req.user.userId,
        address: address,
        description: description,
        cityId: cityId,
        phone: phone,
        website: website,
        hours: hours,
        barId: barId,
      },
      type: QueryTypes.UPDATE,
    }
  );
  return res.json({
    message: "Update succeeded.",
  });
};

//delete bar
exports.deleteBarById = async (req, res) => {
  const barId = req.params.id;
  const userId = req.user.userId;

  const [results, metadata] = await sequelize.query(
    `SELECT * FROM bar WHERE id = $barId`,
    {
      bind: { barId: barId },
    }
  );

  console.log("barägare", bars.user_id_fk);

  if (!results || results.length == 0) {
    throw new NotFoundError("We could not find the bar you are looking for");
  }

  if (req.user.is_admin == 1 || userId == bars.user_id_fk) {
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
    return res
      .json({
        message: "Deleted bar succefully.",
      })
      .sendStatus(204);
  } else {
    throw new UnauthorizedError("No permission to delete this bar");
  }
};
