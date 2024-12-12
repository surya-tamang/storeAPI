import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  userID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },

      price: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
});

const cartModel = mongoose.model("Cart", cartSchema);

export default cartModel;
