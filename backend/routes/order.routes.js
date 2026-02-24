import express from "express";
import { createOrder, deleteOrder, getOrders, updateOrder } from "../controllers/order.controller.js";

const router = express.Router();

router.get("/", getOrders);

router.post("/", createOrder);

router.put("/:id", updateOrder);

router.delete("/:id", deleteOrder);

export default router;
