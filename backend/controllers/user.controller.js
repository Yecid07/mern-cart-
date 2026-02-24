import mongoose from "mongoose";
import User from "../models/user.model.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.log("Error in fetching users:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createUser = async (req, res) => {
  const user = req.body;

  if (!user.name || !user.email) {
    return res.status(400).json({ success: false, message: "Please provide all required fields" });
  }

  try {
    const email = user.email.toLowerCase().trim();
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "User with that email already exists" });
    }

    const newUser = new User({ ...user, email });
    await newUser.save();

    res.status(201).json({ success: true, data: newUser });
  } catch (error) {
    console.log("Error in creating user:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

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
        return res.status(409).json({ success: false, message: "Email already in use" });
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

    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    console.log("Error in deleting user:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
