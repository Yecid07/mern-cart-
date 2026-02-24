import mongoose from "mongoose";
import Order from "../models/order.model.js";

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email")
      .populate("items.product", "name price image");

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.log("Error in fetching orders:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createOrder = async (req, res) => {
  const order = req.body;

  if (!order.user || !Array.isArray(order.items) || order.items.length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide required order fields" });
  }

  const computedTotal = order.items.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0
  );

  if (!Number.isFinite(computedTotal)) {
    return res.status(400).json({ success: false, message: "Invalid order items data" });
  }

  try {
    const newOrder = new Order({
      user: order.user,
      items: order.items,
      total: computedTotal,
      status: order.status,
    });

    await newOrder.save();

    const populatedOrder = await Order.findById(newOrder._id)
      .populate("user", "name email")
      .populate("items.product", "name price image");

    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error) {
    console.log("Error in creating order:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const order = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid order ID" });
  }

  if (order.items && Array.isArray(order.items)) {
    const recomputedTotal = order.items.reduce(
      (acc, item) => acc + Number(item.price) * Number(item.quantity),
      0
    );

    if (!Number.isFinite(recomputedTotal)) {
      return res.status(400).json({ success: false, message: "Invalid order items data" });
    }

    order.total = recomputedTotal;
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(id, order, {
      new: true,
      runValidators: true,
    })
      .populate("user", "name email")
      .populate("items.product", "name price image");

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, data: updatedOrder });
  } catch (error) {
    console.log("Error in updating order:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid order ID" });
  }

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.log("Error in deleting order:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
