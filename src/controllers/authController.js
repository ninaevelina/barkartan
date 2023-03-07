const { UnauthenticatedError } = require("../utils/errors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sequelize } = require("../database/config");
const { QueryTypes } = require("sequelize");
const { userRoles } = require("../constants/users");

exports.register = async (req, res) => {
  // Place desired username, email and password into local variables
  const { username, password, email } = req.body;

  // Encrypt the desired password
  const salt = await bcrypt.genSalt(10);
  const hashedpassword = await bcrypt.hash(password, salt);

  // Check if there are users in the database
  const [results, metadata] = await sequelize.query(
    "SELECT id FROM user LIMIT 1"
  );

  // Add user to database (make admin if first user)
  if (!results || results.length < 1) {
    // prettier-ignore
    await sequelize.query(
			'INSERT INTO user (username, email, password, is_admin) VALUES ($username, $email, $password, 1)', 
			{
				bind: {
          username: username,
					password: hashedpassword,
					email: email
				}
			}
		)
  } else {
    // prettier-ignore
    await sequelize.query(
			'INSERT INTO user (username, email, password) VALUES ($username, $email, $password)', 
			{
				bind: {
          username: username,
					password: hashedpassword,
					email: email,
				},
			}
		)
  }

  // Request response
  return res.status(201).json({
    message: "Registration succeeded. Please log in.",
  });
};

exports.login = async (req, res) => {
  // Place candidate email and password into local variables
  const { email, password: canditatePassword } = req.body;

  const [user, metadata] = await sequelize.query(
    "SELECT * FROM user WHERE email = $email LIMIT 1;",
    {
      bind: { email },
      type: QueryTypes.SELECT,
    }
  );

  console.log(user);

  if (!user) throw new UnauthenticatedError("Please create an account");

  const isPasswordCorrect = await bcrypt.compare(
    canditatePassword,
    user.password
  );
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  const jwtPayload = {
    userId: user.id,
    email: user.email,
    is_admin: user.is_admin,
  };

  const jwtToken = jwt.sign(jwtPayload, process.env.JWT_SECRET, {
    expiresIn: "1h" /* 1d */,
  });

  return res.json({ token: jwtToken, user: jwtPayload });
};
