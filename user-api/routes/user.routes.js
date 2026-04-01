import express from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
  getUserById,
  receiveMessage,
} from "../controllers/user.controller.js";

const router = express.Router();

// CRUD básico
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

// Endpoint de comunicación inter-API (recibe de Order API)
router.post("/message", receiveMessage);

export default router;
