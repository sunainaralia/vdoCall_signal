const { Router } = require("express");
const { signUpUser, LoginUser } = require("../Controllers/UserController.js");
const userRouter = Router();

userRouter.route('/')
  .post(signUpUser);

userRouter.route('/login/')
  .post(LoginUser);

module.exports = { userRouter};

