const express = require("express");
const { protect, admin } = require("../middlewares/authMiddleware");
const {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  deleteGroup,
  addMember,
  removeMember,
  depositFunds,
  withdrawFunds,
  leaveGroup,
  transferFunds,
} = require("../controllers/groupController");

const router = express.Router();

router.post("/", protect, createGroup); // Create a new group
router.get("/", protect, getGroups); // Get all groups
router.get("/:id", protect, getGroupById); // Get a single group by ID
router.put("/:id", protect, updateGroup); // Update group details
router.delete("/:id", protect, admin, deleteGroup); // Delete a group (admin only)

router.put("/:id/addMember", protect, addMember); // Add a member to the group
router.put("/:id/removeMember", protect, removeMember); // Remove a member from the group

router.put("/:id/deposit", protect, depositFunds); // Deposit money into group funds
router.put("/:id/withdraw", protect, withdrawFunds); // Withdraw money from group funds
router.post("/:id/leave", protect, leaveGroup);
router.post("/transfer", protect, admin, transferFunds);
module.exports = router;
