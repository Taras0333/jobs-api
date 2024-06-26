const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");

const auth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthenticatedError("JWT token is missing");
  }

  try {
    const token = authorization.split(" ")[1]?.trim();
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.user = { id: payload.id, name: payload.name };

    next();
  } catch (error) {
    throw new UnauthenticatedError("JWT token is invalid");
  }
};

module.exports = auth;
