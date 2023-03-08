const { UnauthenticatedError, UnauthorizedError } = require("../utils/errors");
const jwt = require("jsonwebtoken");

exports.isAuthenticated = async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log("payload auth", payload);

    req.user = {
      //@ts-ignore
      userId: payload.userId,
      //@ts-ignore
      username: payload.username,
      //@ts-ignore
      is_admin: payload.is_admin,
    };
    console.log("userId", req.user.id, req.user.username, payload);
    next();
  } catch (error) {
    throw new UnauthenticatedError("Authentication invalid");
  }
};
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user.is_admin === 1) {
      throw new UnauthorizedError("Unauthorized Access");
    }
    next();
  };
};
