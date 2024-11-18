import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  images: [{ type: String, required: true }],
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      rating: { type: Number, required: true },
      review: { type: String },
    },
  ],
});

const Products = mongoose.model("product", productSchema);
export default Products;
