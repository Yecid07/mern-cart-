import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(express.json());

// CORS para llamadas desde otras nubes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// Health Check - Para Cloud Run
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User API is healthy",
    service: "user-api",
    version: "2.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "User API v2.0 - GCP Cloud Run",
    service: "user-api",
    version: "2.0",
    documentation: "/api/v2/users",
    environment: process.env.NODE_ENV || "development",
  });
});

// API Routes
app.use("/api/v2/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
  });
});

// Start server
app.listen(PORT, () => {
  connectDB();
  console.log(`\n🚀 User API Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`📝 API: http://localhost:${PORT}/api/v2/users`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`\n`);
});

export default app;
