import express from "express";
const userRouter = express.Router();
import {
  loginUser,
  signupUser,
  updateUser,
  getUserProfile,
  getUsers,
  deleteUser,
  logoutUser,
  refreshAccessToken,
  updateUserProfile,
} from "../controller/userController.js";
import verifyJwt from "../middleware/authMiddleware.js";

userRouter.route("/").get(getUsers);
userRouter
  .route("/profile")
  .get(verifyJwt, getUserProfile)
  .put(verifyJwt, updateUser)
  .post(verifyJwt, updateUserProfile);
userRouter.route("/login").post(loginUser);
userRouter.route("/signup").post(signupUser);
userRouter.route("/refreshToken").post(refreshAccessToken);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/:id").delete(deleteUser);
export default userRouter;
