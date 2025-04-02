const asyncHandler = require("express-async-handler");
const Contribution = require("../models/contributionModel");
const sendEmail = require("../utils/sendEmail");
const Kitty = require("../models/kittyModel");

// Get all contributions
const getAllContributions = asyncHandler(async (req, res) => {
  const contributions = await Contribution.find().sort({ createdAt: -1 });
  res.status(200).json(contributions);
});

// Delete a contribution
const deleteContribution = asyncHandler(async (req, res) => {
  const contribution = await Contribution.findById(req.params.id);
  if (!contribution) {
    res.status(404);
    throw new Error("Contribution not found");
  }

  await contribution.deleteOne();
  res.status(200).json({ message: "Contribution deleted successfully" });
});

// Approve a contribution and send email
const approveContribution = asyncHandler(async (req, res) => {
    const contribution = await Contribution.findById(req.params.id);
  
    if (!contribution) {
      res.status(404);
      throw new Error("Contribution not found");
    }
  
    if (contribution.status === "approved") {
      res.status(400).json({ message: "Contribution is already approved" });
      return;
    }
  
    // Update status to approved
    contribution.status = "approved";
    await contribution.save();
  
    const kitty = await Kitty.findOne({kittyAddress:contribution.kittyAddress}); 
    if (kitty) {
      kitty.kittyAmount += contribution.amount;
      kitty.totalAmount += contribution.amount;
      await kitty.save();
    } else {
      res.status(404);
      throw new Error("Kitty not found");
    }
  
    // Send email notification
    const emailSubject = "Contribution Approved";
    const emailText = `Hello ${contribution.name},\n\nYour contribution of KES ${contribution.amount} has been approved and added to the kitty.\n\nThank you for your support.`;
  
    await sendEmail(contribution.email, emailSubject, emailText);
  
    res.status(200).json(contribution);
  });
  

module.exports = { getAllContributions, deleteContribution, approveContribution };
