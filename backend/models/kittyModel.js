const mongoose = require('mongoose');

const kittySchema = new mongoose.Schema({
  kittyName: { type: String, required: true },
  kittyDescription: { type: String, required: true },
  kittyType: { 
    type: String, 
    enum: ['Rotating Savings', 'Fixed Savings', 'Flexible Contributions'], 
    required: true 
  },
  beneficiaryNumber: { type: Number, required: true },
  maturityDate: { type: Date, required: true },
  contributionLink: { type: String, required: false },
  transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
  totalAmount: { type: Number, default: 0 },
  
  // New fields
  kittyEmail: { type: String, required: false }, // New email field
  kittyAddress: { type: String, required: false }, // New address field
  kittyAmount: { type: Number, default: 0 }, // New amount field
  
  // Track creator (reference to User model)
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },

  contributors: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    amount: { type: Number },
    contributedAt: { type: Date, default: Date.now }
  }],
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

kittySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Kitty = mongoose.model('Kitty', kittySchema);
module.exports = Kitty;
