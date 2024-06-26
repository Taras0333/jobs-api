const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
    minlength: [4, "The name should be more then 3 characters "],
    maxlength: [15, "The name should be less then 11 characters "],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please provide a valid email",
    ],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [4, "The password should be more then 3 characters "],
  },
});

UserSchema.pre("save", async function () {
  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

UserSchema.methods.generateJWTToken = function () {
  const { JWT_SECRET, JWT_LIFETIME } = process.env;
  return jwt.sign(
    { name: this.name, email: this.email, id: this._id },
    JWT_SECRET,
    {
      expiresIn: JWT_LIFETIME,
    }
  );
};

UserSchema.methods.validatePassword = async function (passwordToValidate) {
  const isMatched = bcryptjs.compare(passwordToValidate, this.password);
  return isMatched;
};

module.exports = mongoose.model("User", UserSchema);
