import express from "express";
const userRouter = express.Router();
import {
  loginUser,
  signupUser,
  updateUser,
  getUser,
  getUsers,
  deleteUser,
} from "../controller/userController.js";

userRouter.route("/").get(getUsers);
userRouter.route("/:id").get(getUser).put(updateUser).delete(deleteUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/signup").post(signupUser);

export default userRouter;
