const User = require('../Models/UserModel.js'); // Import User model
const CustomErrorHandler = require("../Utils/CustomErrorHandler.js"); // Custom error handler utility
const asyncFunHandler = require("../Utils/asyncFunHandler.js"); // Async function handler to catch errors

// Sign-up User Controller
const signUpUser = asyncFunHandler(async (req, res, next) => {
  // Create a new user in the database from the request body
  let user = await User.create(req.body);
  return res.status(201).json({
    success: true,
    msg: "User is created successfully", // Success message
    data: user, // Return the user data
  });
});

// Login User Controller
const LoginUser = asyncFunHandler(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    let err = new CustomErrorHandler("Email or password is not provided", 400);
    return next(err); 
  }
  const user = await User.findOne({ email });
  if (!user) {
    let err = new CustomErrorHandler("Email or password is incorrect", 400);
    return next(err); 
  }
  res.status(200).json({
    success: true,
    msg: "User logged in successfully", 
    data: user, 
  });
});

module.exports = {
  signUpUser,
  LoginUser
};