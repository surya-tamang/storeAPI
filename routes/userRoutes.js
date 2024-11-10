const express = require("express");
const userRouter = express.Router();
const {
  loginUser,
  signupUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
} = require("../controller/userController");

userRouter.route("/").get(getUsers);
userRouter.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/signup").post(signupUser);

module.exports = userRouter;
