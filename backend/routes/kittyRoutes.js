const express = require("express");
const {
  createKitty,
  editKitty,
  getAllKitties,
  getKittyById,
  joinKitty,
  payoutKitty,
  handleRotatingPayout,
  handleFixedPayout,
  handleFlexibleWithdrawal,
  getKittiesByUser,
  deleteKitty,
} = require("../controllers/kittyController");
const { protect, admin } = require("../middlewares/authMiddleware");

const router = express.Router();

//  Create a new kitty
router.post("/", protect, createKitty);
router.put("/:id", protect, editKitty);
//  Join a kitty
router.post('/join', protect, joinKitty);
//  Get all kitties (Admin or User)
router.get("/", protect,admin, getAllKitties);

//  Get kitties created by current user
router.get("/user", protect, getKittiesByUser);

//  Get a single kitty by ID
router.get("/:id", protect, getKittyById);

//handle payout
router.post("/payout", protect, payoutKitty);

//  Payout (Rotating Savings)
router.post("/payout/rotating", protect, handleRotatingPayout);

//  Payout (Fixed Savings)
router.post("/payout/fixed", protect, handleFixedPayout);

// Withdrawal (Flexible Savings)
router.post("/withdraw", protect, handleFlexibleWithdrawal);

//  Delete a kitty
router.delete("/:id", protect,admin, deleteKitty);



module.exports = router;
