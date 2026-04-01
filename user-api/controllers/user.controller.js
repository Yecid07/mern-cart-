import mongoose from "mongoose";
import User from "../models/user.model.js";

/**
 * GET /api/v2/users
 * Recupera todos los usuarios
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({
      success: true,
      data: users,
      apiVersion: "2.0",
      service: "user-api",
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    console.log("Error in fetching users:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * GET /api/v2/users/:id
 * Obtiene un usuario por ID
 */
export const getUserById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: user,
      apiVersion: "2.0",
      service: "user-api",
    });
  } catch (error) {
    console.log("Error in fetching user:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * POST /api/v2/users
 * Crea un nuevo usuario
 * Body esperado: { name, email, role? }
 */
export const createUser = async (req, res) => {
  const user = req.body;

  if (!user.name || !user.email) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const email = user.email.toLowerCase().trim();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, message: "User with that email already exists" });
    }

    const newUser = new User({ ...user, email });
    await newUser.save();

    res.status(201).json({
      success: true,
      data: newUser,
      apiVersion: "2.0",
      service: "user-api",
    });
  } catch (error) {
    console.log("Error in creating user:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * PUT /api/v2/users/:id
 * Actualiza un usuario
 */
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const user = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid user ID" });
  }

  try {
    if (user.email) {
      const email = user.email.toLowerCase().trim();
      const existingUser = await User.findOne({ email, _id: { $ne: id } });

      if (existingUser) {
        return res
          .status(409)
          .json({ success: false, message: "Email already in use" });
      }

      user.email = email;
    }

    const updatedUser = await User.findByIdAndUpdate(id, user, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, data: updatedUser });
  } catch (error) {
    console.log("Error in updating user:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * DELETE /api/v2/users/:id
 * Elimina un usuario
 */
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      deletedUser,
    });
  } catch (error) {
    console.log("Error in deleting user:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

/**
 * POST /api/v2/users/message
 * Recibe mensaje del Order API (Sebas) con datos de Order
 * Agrega datos del Usuario y propaga la respuesta hacia arriba
 * 
 * Flujo:
 * Cliente → AWS Gateway → Sebas (Order) → Yécid (User) → Respuesta
 */
export const receiveMessage = async (req, res) => {
  try {
    const { data = {}, orderId = null } = req.body;

    console.log(`📨 Received message from Order API with orderId: ${orderId}`);

    // Obtener usuario asociado (si existe)
    let userEntity = null;
    if (data.userId) {
      userEntity = await User.findById(data.userId);
    }

    // Si no existe, crear un usuario de ejemplo para demostración
    if (!userEntity) {
      userEntity = {
        _id: "demo-user-123",
        name: "Yécid García",
        email: "yecid@user-api.gcp",
        role: "admin",
      };
    }

    // Enriquecer el mensaje con los datos del usuario
    const enrichedData = {
      ...data,
      user: userEntity,
      userApiVersion: "2.0",
      userService: "user-api",
      processedAt: new Date().toISOString(),
    };

    console.log(`✅ User data added to message`);

    // Aquí es donde normalmente iría la llamada al siguiente servicio
    // pero en tu caso, Yécid es el último en la cadena, así que devolvemos

    res.status(200).json({
      success: true,
      data: enrichedData,
      apiVersion: "2.0",
      service: "user-api",
      message: "User data aggregated successfully",
    });
  } catch (error) {
    console.log("Error in receiving message:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
