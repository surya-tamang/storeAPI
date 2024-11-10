const express = require("express");
const productRouter = express.Router();
const {
  getProduct,
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} = require("../controller/productControl");

productRouter.route("/").get(getProducts).post(addProduct);
productRouter
  .route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = productRouter;
