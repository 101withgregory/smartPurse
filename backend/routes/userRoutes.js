const express = require("express");
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser 
} = require("../controllers/userController.js");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected Routes (Requires Authentication)
router.get("/", protect, admin, getAllUsers);  // Admin-only: Get all users
router.get("/:id", protect, getUserById);      // Get user profile
router.put("/:id", protect, updateUser);       // Update user (self or admin)
router.delete("/:id", protect, admin, deleteUser); // Admin can delete user

module.exports = router;
