const express = require("express");
const { 
  registerUser, 
  loginUser, 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getProfile
} = require("../controllers/userController.js");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// route for validating user session
router.get("/me", protect, getProfile);
// Protected Routes (Requires Authentication)

router.get("/", protect, admin, getAllUsers);  // Admin-only: Get all users
router.get("/:id", protect, getUserById);    
router.put("/:id", protect, updateUser);       // Update user (self or admin)
router.delete("/:id", protect, admin, deleteUser); // Admin can delete user

module.exports = router;
