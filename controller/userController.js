import User from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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
    const token = jwt.sign(
      {
        userId: existingUser._id,
        email: existingUser.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    res.cookie("token", token, {
      maxAge: 15 * 60 * 1000,
    });
    return res.status(200).json({ msg: "login successful" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};
export const signupUser = async (req, res) => {
  const { first_name, last_name, phone, address, email, password } = req.body;
  try {
    if (
      !first_name ||
      !last_name ||
      !phone ||
      !address ||
      !email ||
      !password
    ) {
      return res.status(400).json({ msg: "all fields required" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "email already exist" });
    }
    // generating hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPwd = await bcrypt.hash(password, salt);

    // adding new user
    const newUser = new User({
      first_name,
      last_name,
      phone: Number(phone),
      address,
      email,
      password: hashedPwd,
    });
    await newUser.save();
    return res.status(200).json({ msg: "signed up success" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
    first_name,
    last_name,
    phone,
    email,
    address,
    profile_pic,
    password,
  } = req.body;
  try {
    const user = {};
    if (first_name) user.first_name = first_name;
    if (last_name) user.last_name = last_name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) user.address = address;
    if (profile_pic) user.profile_pic = profile_pic;
    if (password) {
      const hashedPwd = await bcrypt.hash(password, 10);
      user.password = hashedPwd;
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      { $set: user },
      { new: true }
    );
    if (!updateUser) {
      return res.status(400).json({ msg: "user not found" });
    }
    return res.status(200).json({ msg: "user updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};
export const getUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(201).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};
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
