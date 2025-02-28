require('dotenv').config(); // Load environment variables
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Enables CORS for frontend communication
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/vaultfund';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Test Route
app.get('/', (req, res) => {
    res.send('VaultFund Backend is Running 🚀');
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
