import express from "express";
const productRouter = express.Router();
import {
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controller/productControl.js";

productRouter.route("/").get(getProducts).post(addProduct);
productRouter
  .route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default productRouter;
