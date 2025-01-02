import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  sendEmailVerificationCode,
  sendPasswordResetEmail,
} from "../email/email.js";

// generate access and refresh tokens of users

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Short-lived access token
  );
  const refreshToken = jwt.sign(
    {
      userId: user._id,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Long-lived refresh token
  );
  return { accessToken, refreshToken };
};

// controll user logins

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(400).json({ msg: "no user found" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect email or password" });
    }
    const loggedInUser = await User.findById(existingUser._id).select(
      "-password"
    );
    // generating tokens
    const { accessToken, refreshToken } = generateTokens(existingUser);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res
      .status(200)
      .json({ user: loggedInUser, accessToken: accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};

// controll user register

export const signupUser = async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ msg: "all fields required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "email already exist" });
    }
    // generating hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    //generating verification code
    const verificationToken = Math.floor(Math.random() * 1000000);

    // adding new user
    const newUser = new User({
      first_name,
      last_name,
      email,
      password: hashedPwd,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, // 1 hour
    });
    await newUser.save();
    await sendEmailVerificationCode(email, verificationToken);
    return res.status(200).json({ msg: "signed up success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};

// verifying email

export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    const user = await User.findOne({ verificationToken: code });
    if (!user) {
      return res.status(401).json({ msg: "Invalid token" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;

    await user.save();
    res.status(200).json({ msg: "Email verified" });
  } catch (error) {
    console.log(error);
  }
};

// controll updating user

export const updateUser = async (req, res) => {
  const { first_name, last_name, phone, email, address, password } = req.body;

  try {
    const user = {};
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (password) {
      const hashedPwd = await bcrypt.hash(password, 10);
      user.password = hashedPwd;
    }

    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: user },
      { new: true }
    ).select("-password");

    if (!updateUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    return res
      .status(200)
      .json({ msg: "User updated successfully", user: updateUser });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// updating profile picture

export const updateUserProfile = async (req, res) => {
  try {
    const filePath = req.file?.path;

    if (!filePath) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { avatar: filePath } },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found." });
    }

    return res
      .status(200)
      .json({ message: "Profile updated successfully.", user: updatedUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// get particular user by ID

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};

// get all users

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(201).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};

// detete user

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(400).json({ msg: "no user found" });
    }
    return res
      .status(200)
      .json({ msg: "deleted success", deleted_user: deleteUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};

// handle refreshing tokens

export const refreshAccessToken = (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(req.cookies);
  if (!refreshToken) {
    return res.status(403).json({ message: "No refresh token provided" });
  }
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    // console.log(decoded);
    // Generate new access token
    const newAccessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    // Send new access token in response
    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

// Logout controller (clear refresh token cookie)
export const logoutUser = (req, res) => {
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

//forgotten password

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User doesn't exist" });
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();

    await sendPasswordResetEmail(
      user.email,
      `http://localhost:4000/trendhop/reset_password/${resetToken}`
    );
    return res
      .status(200)
      .json({ user: user, msg: "Password reset link sent to your email" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

// resetPassword
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }

    // update password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();

    await sendPasswordResetEmail(user.email);

    res
      .status(200)
      .json({ success: true, message: "Password reset successful" });
  } catch (error) {
    console.log("Error in resetPassword ", error);
    res.status(400).json({ success: false, message: error.message });
  }
};
