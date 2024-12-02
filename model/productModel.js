import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountRate: {
      type: Number,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sub_category: {
      type: String,
      required: true,
    },
    colors: [{ type: String }],
    sizes: [{ type: String }],
    images: [{ type: String, required: true }],
    ratings: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        rating: { type: Number, required: true },
        review: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Products = mongoose.model("product", productSchema);
export default Products;
