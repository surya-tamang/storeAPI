import Order from "../model/orderModel.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    if (!orders) {
      return res.json({ msg: "No orders found" });
    }
    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
export const getParticularOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.json({ msg: "No orders found" });
    }
    return res.status(200).json(order);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
export const createOrder = async (req, res) => {
  const { userId, items, totalPrice, paymentMethod, paymentStatus } = req.body;
  try {
    const newOrder = new Order({
      userId,
      items,
      totalPrice,
      paymentMethod,
      paymentStatus,
    });
    await newOrder.save();
    return res
      .status(200)
      .json({ msg: "Order created successfully", order: newOrder });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    await Order.findByIdAndDelete(id);
    return res.status(200).json({ msg: "Order deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
