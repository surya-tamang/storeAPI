import express from "express";
import upload from "../middleware/multerConfig.js";

const productRouter = express.Router();
import {
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  filterProduct,
} from "../controller/productControl.js";

productRouter
  .route("/")
  .get(getProducts)
  .post(upload.array("images", 5), addProduct);

productRouter.route("/filter/").get(filterProduct);

productRouter
  .route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default productRouter;
