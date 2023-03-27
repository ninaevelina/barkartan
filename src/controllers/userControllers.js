const { userRoles } = require("../constants/users");
const {
  NotFoundError,
  UnauthorizedError,
  BadRequestError,
} = require("../utils/errors");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  const [users, metadata] = await sequelize.query(
    "SELECT id, username FROM user"
  );
  console.log(users);
  return res.json(users);
};

exports.getUserById = async (req, res) => {
  const userId = req.params.id;

  const [user, metadata] = await sequelize.query(
    "SELECT id, username, email FROM user WHERE id = $userId",
    {
      bind: { userId },
      type: QueryTypes.SELECT,
    }
  );
  if (!user) throw new NotFoundError("That user does not exist");

  return res.json(user);
};

exports.deleteUserById = async (req, res) => {
  const userId = req.params.id;

  if (userId !== req.user?.id && req.user.is_admin === 0) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  const [results, metadata] = await sequelize.query(
    `SELECT * FROM user WHERE id = $userId`,
    {
      bind: { userId: userId },
    }
  );

  if (!results || !results[0])
    throw new NotFoundError("That user does not exist");

  await sequelize.query(`DELETE FROM review WHERE user_id_fk = $userId`, {
    bind: { userId: userId },
  });

  await sequelize.query(`DELETE FROM bar WHERE user_id_fk = $userId`, {
    bind: { userId: userId },
  });

  await sequelize.query(`DELETE FROM user WHERE id = $userId RETURNING *`, {
    bind: { userId: userId },
  });

  return res.status(204).json({
    message: "succesfully deleted user",
  });
};

exports.updateUserById = async (req, res) => {
  const { username, password, email } = req.body;
  const updateUserId = req.params.id;
  const userId = req.user.userId;

  const [userExists] = await sequelize.query(
    `SELECT * FROM user WHERE id = $updateUserId;`,
    {
      bind: {
        updateUserId: updateUserId,
      },
      type: QueryTypes.SELECT,
    }
  );

  if (req.user?.is_admin != 1 && updateUserId != userId) {
    throw new UnauthorizedError("Unauthorized Access");
  }

  if (!userExists || userExists.length < 1) {
    throw new BadRequestError("That user does not exist");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  const [updatedUser] = await sequelize.query(
    `UPDATE user SET username = $username, password = $password, email = $email WHERE id = $userId RETURNING *;`,
    {
      bind: {
        username: username,
        password: hashedpassword,
        email: email,
        userId: userId,
      },

      type: QueryTypes.UPDATE,
    }
  );

  return res.json({
    message: "User has been updated!",
  });
};
