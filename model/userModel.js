const mongoose = require("mongoose");

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
    },
    address: {
      type: String,
    },
    profile_pic: {
      type: String,
    },
  },
  {
    strict: false,
  }
);

const Users = mongoose.model("user", userSchema);
module.exports = Users;
