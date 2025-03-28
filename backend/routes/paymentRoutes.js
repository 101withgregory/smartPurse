const express = require("express");
const { initiatePayment, confirmPayment,contributeToKitty, handleMpesaCallback } = require("../controllers/paymentController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/initiate", protect, initiatePayment);
router.post("/confirm", confirmPayment);
router.post("/contribute", protect, contributeToKitty);
router.post("/callback", handleMpesaCallback);
module.exports = router;
