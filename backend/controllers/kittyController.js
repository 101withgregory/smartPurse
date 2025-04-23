const asyncHandler = require('express-async-handler');
const Kitty = require('../models/kittyModel');
const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');
const mongoose = require('mongoose');
//  Create Kitty
const createKitty = asyncHandler(async (req, res) => {
  const {
    kittyName,
    kittyEmail,
    kittyAddress,
    kittyAmount,
    kittyDescription,
    kittyType,
    beneficiaryNumber,
    maturityDate,
  } = req.body;

  // ✅ Ensure maturity date is valid
  const parsedMaturityDate = new Date(maturityDate);
  if (isNaN(parsedMaturityDate)) {
    res.status(400);
    throw new Error("Invalid maturity date");
  }

  // ✅ Ensure case-insensitive uniqueness
  const kittyExists = await Kitty.findOne({
    kittyName: { $regex: new RegExp(`^${kittyName}$`, "i") }
  });

  if (kittyExists) {
    res.status(400);
    throw new Error("Kitty already exists");
  }

  // ✅ Create Kitty
  const kitty = await Kitty.create({
    kittyName,
    kittyEmail,
    kittyAddress,
    kittyAmount: kittyAmount || 0,
    kittyDescription,
    kittyType,
    beneficiaryNumber,
    maturityDate: parsedMaturityDate,
    createdBy: req.user._id,
  });

  // ✅ Update with correct `contributionLink`
  kitty.contributionLink = `${process.env.FRONTEND_URL}/contribute/${kitty._id}`;
  await kitty.save();

  // ✅ Structured response
  res.status(201).json({
    message: "Kitty created successfully",
    kitty: {
      id: kitty._id,
      kittyName: kitty.kittyName,
      kittyEmail: kitty.kittyEmail,
      kittyAddress: kitty.kittyAddress,
      kittyAmount: kitty.kittyAmount,
      kittyDescription: kitty.kittyDescription,
      kittyType: kitty.kittyType,
      beneficiaryNumber: kitty.beneficiaryNumber,
      maturityDate: kitty.maturityDate,
      contributionLink: kitty.contributionLink,
      createdBy: kitty.createdBy,
    }
  });
});


const editKitty = asyncHandler(async (req, res) => {
  const { 
    kittyName, 
    kittyAmount, // New field
    kittyDescription, 
    kittyType, 
    beneficiaryNumber, 
    maturityDate 
  } = req.body;

  const kitty = await Kitty.findById(req.params.id);

  if (!kitty) {
    res.status(404);
    throw new Error("Kitty not found");
  }

  kitty.kittyName = kittyName || kitty.kittyName; // Update if provided
  kitty.kittyAmount = kittyAmount !== undefined ? kittyAmount : kitty.kittyAmount; // Allow 0 value
  kitty.kittyDescription = kittyDescription || kitty.kittyDescription;
  kitty.kittyType = kittyType || kitty.kittyType;
  kitty.beneficiaryNumber = beneficiaryNumber || kitty.beneficiaryNumber;
  kitty.maturityDate = maturityDate || kitty.maturityDate;

  const updatedKitty = await kitty.save();
  res.status(200).json(updatedKitty);
});


// Join a Kitty
const joinKitty = asyncHandler(async (req, res) => {
    const { kittyId } = req.body;
  
    const kitty = await Kitty.findById(kittyId);
    if (!kitty) {
      res.status(404);
      throw new Error('Kitty not found');
    }
  
    // Check if user is already a member
    const isMember = kitty.contributors.some(
      (contributor) => contributor.userId.toString() === req.user._id.toString()
    );
  
    if (isMember) {
      res.status(400);
      throw new Error('User already joined this kitty');
    }
  
    // Add user to contributors list (without amount since no contribution yet)
    kitty.contributors.push({
      userId: req.user._id,
      amount: 0,
    });
  
    await kitty.save();
  
    res.status(200).json({
      message: `Successfully joined kitty ${kitty.kittyName}`,
      kitty,
    });
  });
// Get All Kitties
const getAllKitties = asyncHandler(async (req, res) => {
  const kitties = await Kitty.find().populate('createdBy', 'name');
  res.status(200).json(kitties);
});
// Payout logic
const payoutKitty = asyncHandler(async (req, res) => {
    const { kittyId, amount } = req.body;
  
    const kitty = await Kitty.findById(kittyId);
    if (!kitty) {
      res.status(404);
      throw new Error("Kitty not found");
    }
  
    if (amount > kitty.totalAmount) {
      res.status(400);
      throw new Error("Insufficient funds");
    }
  
    kitty.totalAmount -= amount;
    await kitty.save();
  
    res.status(200).json({
      message: `Payout of ${amount} from kitty ${kitty.kittyName} was successful`,
    });
  });
//  Handle Payout for Rotating Savings
const handleRotatingPayout = asyncHandler(async (req, res) => {
  const { kittyId } = req.body;

  const kitty = await Kitty.findById(kittyId).populate('contributors.userId');
  if (!kitty) {
    res.status(404);
    throw new Error('Kitty not found');
  }

  if (kitty.kittyType !== 'Rotating Savings') {
    res.status(400);
    throw new Error('This is not a rotating savings kitty');
  }

  if (kitty.contributors.length < kitty.beneficiaryNumber) {
    res.status(400);
    throw new Error('Not enough contributors to fulfill the payout');
  }

  // Select Beneficiary
  const beneficiaryIndex = kitty.totalAmount % kitty.beneficiaryNumber;
  const beneficiary = kitty.contributors[beneficiaryIndex];

  if (!beneficiary) {
    res.status(400);
    throw new Error('Invalid beneficiary data');
  }

  // Record Transaction
  const transaction = await Transaction.create({
    kittyId: kitty._id,
    user: beneficiary.userId._id,
    amount: kitty.totalAmount,
    transactionType: 'CASH-OUT',
    status: 'successful',
  });

  kitty.totalAmount = 0;
  await kitty.save();

  res.status(200).json({
    message: `Payout of ${transaction.amount} sent to ${beneficiary.userId.name}`,
    transaction,
  });
});

//  Handle Payout for Fixed Savings
const handleFixedPayout = asyncHandler(async (req, res) => {
  const { kittyId } = req.body;

  const kitty = await Kitty.findById(kittyId).populate('contributors.userId');
  if (!kitty) {
    res.status(404);
    throw new Error('Kitty not found');
  }

  if (kitty.kittyType !== 'Fixed Savings') {
    res.status(400);
    throw new Error('This is not a fixed savings kitty');
  }

  if (kitty.contributors.length < kitty.beneficiaryNumber) {
    res.status(400);
    throw new Error('Not enough contributors to fulfill the payout');
  }

  const payoutAmount = kitty.totalAmount / kitty.beneficiaryNumber;
  const beneficiaries = kitty.contributors.slice(0, kitty.beneficiaryNumber);

  for (const beneficiary of beneficiaries) {
    await Transaction.create({
      kittyId: kitty._id,
      user: beneficiary.userId._id,
      amount: payoutAmount,
      transactionType: 'CASH-OUT',
      status: 'successful',
    });
  }

  kitty.totalAmount = 0;
  await kitty.save();

  res.status(200).json({
    message: `Fixed payout of ${payoutAmount} sent to ${beneficiaries.length} beneficiaries`,
  });
});

//  Handle Flexible Contributions (Withdrawal Limit)
const handleFlexibleWithdrawal = asyncHandler(async (req, res) => {
  const { kittyId, amount } = req.body;

  const kitty = await Kitty.findById(kittyId);
  if (!kitty) {
    res.status(404);
    throw new Error('Kitty not found');
  }

  if (kitty.kittyType !== 'Flexible Contributions') {
    res.status(400);
    throw new Error('This is not a flexible kitty');
  }

  if (kitty.beneficiaryNumber <= 0) {
    res.status(400);
    throw new Error('No available beneficiaries for this withdrawal');
  }

  if (kitty.totalAmount < amount) {
    res.status(400);
    throw new Error('Insufficient funds');
  }

  const transaction = await Transaction.create({
    kittyId: kitty._id,
    user: req.user._id,
    amount,
    kittyAmount,
    transactionType: 'CASH-OUT',
    status: 'successful',
  });

  kitty.totalAmount -= amount;
  await kitty.save();

  res.status(200).json({
    message: `Withdrawal of ${amount} successful`,
    transaction,
  });
});

// Get Single Kitty by ID
const getKittyById = asyncHandler(async (req, res) => {
  const kitty = await Kitty.findById(req.params.id).populate('contributors.userId', 'name');
  if (kitty) {
    res.status(200).json(kitty);
  } else {
    res.status(404);
    throw new Error('Kitty not found');
  }
});

//  Get All Kitties by User
const getKittiesByUser = asyncHandler(async (req, res) => {
  const kitties = await Kitty.find({ createdBy: req.user._id });
  res.status(200).json(kitties);
});

//  Delete Kitty
const deleteKitty = asyncHandler(async (req, res) => {
  const kitty = await Kitty.findById(req.params.id);
  if (kitty) {
    await kitty.deleteOne();
    res.status(200).json({ message: 'Kitty deleted successfully' });
  } else {
    res.status(404);
    throw new Error('Kitty not found');
  }
});

module.exports = {
  createKitty,
  editKitty,
  joinKitty,
  getAllKitties,
  payoutKitty,
  handleRotatingPayout,
  handleFixedPayout,
  handleFlexibleWithdrawal,
  getKittyById,
  getKittiesByUser,
  deleteKitty,
};
