const { StatusCodes } = require("http-status-codes");

const User = require("../models/User");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const { body } = req;

  const user = await User.create({ ...body });

  const token = user.generateJWTToken();

  res.status(StatusCodes.CREATED).json({
    user: {
      name: user.name,
      email: user.email,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequestError("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("The email is not valid");
  }

  const isValidPassword = await user.validatePassword(password);

  if (!isValidPassword) {
    throw new UnauthenticatedError("The password is not valid");
  }

  const token = user.generateJWTToken();

  res.status(StatusCodes.OK).json({ user: { email }, token });
};

module.exports = {
  register,
  login,
};
