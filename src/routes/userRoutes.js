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
  verifyEmail,
  forgotPassword,
  resetPassword,
} from "../controller/userController.js";
import verifyJwt from "../middleware/authMiddleware.js";

userRouter.route("/").get(getUsers);
userRouter
  .route("/profile")
  .get(verifyJwt, getUserProfile)
  .put(verifyJwt, updateUser)
  .post(verifyJwt, updateUserProfile);

// authentication
userRouter.route("/signup").post(signupUser);
userRouter.route("/verifyEmail").post(verifyEmail);
userRouter.route("/login").post(loginUser);
userRouter.route("/refreshToken").post(refreshAccessToken);
userRouter.route("/logout").post(logoutUser);
userRouter.route("/forgotPassword").post(forgotPassword);
userRouter.route("/reset_password/:token").post(resetPassword);

userRouter.route("/:id").delete(deleteUser);
export default userRouter;
