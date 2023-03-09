const { userRoles } = require("../constants/users");
const { NotFoundError, UnauthorizedError } = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");

exports.getAllUsers = async (req, res) => {
  // prettier-ignore
  const [users, metadata] = await sequelize.query('SELECT id, username FROM user')
  console.log(users);
  return res.json(users);
};

exports.getUserById = async (req, res) => {
  // Grab the user id and place in local variable
  const userId = req.params.id;

  // Get the user from the database (NOTE: excluding password)
  const [user, metadata] = await sequelize.query(
    "SELECT id, username, email FROM user WHERE id = $userId",
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );

  // Not found error (ok since since route is authenticated)
  if (!user) throw new NotFoundError("That user does not exist");

  // Send back user info
  return res.json(user);
};

exports.deleteUserById = async (req, res) => {
  // Grab the user id and place in local variable
  const userId = req.params.id;

  //ska vi ha && eller || ??
  if (userId !== req.user?.id && req.user.is_admin === 0) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  // Delete the user from the database
  const [results, metadata] = await sequelize.query(
    "DELETE FROM user WHERE id = $userId RETURNING *",
    {
      bind: { userId },
    }
  );

  // Not found error (ok since since route is authenticated)
  if (!results || !results[0])
    throw new NotFoundError("That user does not exist");

  await sequelize.query("DELETE FROM review WHERE user_id_fk = $userId", {
    bind: { userId },
  });

  // Send back user info
  return res.status(201).json({
    message: "succesfully deleted user",
  });
};
