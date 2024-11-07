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
  // Get the email and password from the request body
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    // If not, return an error using the CustomErrorHandler
    let err = new CustomErrorHandler("Email or password is not provided", 400);
    return next(err); // Pass the error to the next middleware
  }

  // Find the user in the database using the email
  const user = await User.findOne({ email });

  // Check if user exists and the password matches
  if (!user || !(await user.comparePasswordInDb(password, user.password))) {
    let err = new CustomErrorHandler("Email or password is incorrect", 400);
    return next(err); // Pass the error to the next middleware
  }

  // Respond with success message and user data if login is successful
  res.status(200).json({
    success: true,
    msg: "User logged in successfully", // Success message
    data: user, // Return the user data (usually excluding sensitive info like password)
  });
});

module.exports = {
  signUpUser,
  LoginUser
};