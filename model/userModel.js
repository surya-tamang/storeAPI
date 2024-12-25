import mongoose from "mongoose";
const addressSchema = new mongoose.Schema(
  {
    city: {
      type: String,
      required: true,
    },
    tole: {
      type: String,
      required: true,
    },
    near: {
      type: String,
    },
  },
  { _id: false }
);
const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      // required: true,
    },
    address: {
      type: addressSchema,
      // required: true,
    },
    profile_picture: {
      type: String,
    },
  },
  {
    strict: false,
  }
);

const User = mongoose.model("user", userSchema);
export default User;
