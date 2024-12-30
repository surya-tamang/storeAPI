import express from "express";
const userRouter = express.Router();
import {
  loginUser,
  signupUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
  logoutUser,
  refreshAccessToken,
} from "../controller/userController.js";

userRouter.route("/").get(getUsers);
userRouter.route("/login").post(loginUser);
userRouter.route("/signup").post(signupUser);
userRouter.route("/refreshToken").post(refreshAccessToken);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default userRouter;
