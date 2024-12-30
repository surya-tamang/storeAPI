import express from "express";
const orderRouter = express.Router();
import {
  createOrder,
  getOrders,
  getParticularOrder,
  deleteOrder,
} from "../controller/orderControl.js";

orderRouter.route("/").get(getOrders).post(createOrder);
orderRouter.route("/:id").get(getParticularOrder).delete(deleteOrder);

export default orderRouter;
