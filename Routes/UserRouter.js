const { Router } = require("express");
const { signUpUser, LoginUser } = require("../Controllers/UserController.js").default;
const userRouter = Router();

userRouter.route('/')
  .post(signUpUser);

userRouter.route('/login/')
  .post(LoginUser);

module.exports = { userRouter };

