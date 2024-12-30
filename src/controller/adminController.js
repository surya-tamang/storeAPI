import Admin from "../model/adminModel";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const generateTokens = (admin) => {
  const accessToken = jwt.sign(
    {
      userId: admin._id,
      email: admin.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" } // Short-lived access token
  );
  const refreshToken = jwt.sign(
    {
      userId: admin._id,
      email: admin.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Long-lived refresh token
  );
  return { accessToken, refreshToken };
};

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);

    const hashedPwd = await bcrypt.hash(password, salt);
    // Check if the admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ msg: "Admin already exists" });
    }

    // Create new admin
    const newAdmin = new Admin({
      name,
      email,
      password: hashedPwd,
    });

    await newAdmin.save();
    res.status(201).json({ msg: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error });
  }
};
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (!existingAdmin) {
      return res.status(400).json({ msg: "no user found" });
    }
    const isMatch = await bcrypt.compare(password, existingAdmin.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect email or password" });
    }

    // generating tokens
    const { accessToken, refreshToken } = generateTokens(existingAdmin);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({ accessToken: accessToken });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "server error" });
  }
};
export const updateAdmin = async (req, res) => {
  const { id } = req.params;
  const { email, password, name, profile } = req.body;
  try {
    const data = {};
    if (email) data.email = email;
    if (password) data.password = password;
    if (name) data.name = name;
    if (profile) data.profile = profile;

    const admin = await Admin.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );
    if (!admin) {
      return res.status(401).json({ msg: "No user found" });
    }
    return res.status(200).json({ msg: "Updated successfully" });
  } catch (error) {}
};
export const deleteAdmin = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(401).json({ msg: "No user found" });
    }
    return res.status(200).json({ msg: "Deleted successfully" });
  } catch (error) {}
};
