import jwt from "jsonwebtoken";
import User from "../model/userModel.js";

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken || req.headers.authorization?.split(" ")[1];

    // Check if token is provided
    if (!token) {
      return res.status(401).json({ msg: "Unauthorized - No token provided" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user based on the decoded token payload
    const existingUser = await User.findById(decoded.userId).select(
      "-password"
    );
    if (!existingUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    req.user = existingUser;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.msg);

    // Differentiate between invalid token and other errors
    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ msg: "Invalid token" });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token expired" });
    }

    res.status(500).json({ msg: "Internal server error" });
  }
};

export default verifyJwt;
