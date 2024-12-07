import mongoose, { mongo } from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "product" },
  quantity: {
    type: Number,
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
});

const order = mongoose.model("order", orderSchema);
export default order;
