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
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));


// Test Route
app.get('/', (req, res) => {
    res.send('VaultFund Backend is Running 🚀');
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);
const kittyRoutes = require("./routes/kittyRoutes");
app.use("/api/kittys", kittyRoutes);
const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);
const transactionRoutes = require('./routes/transactionRoutes')
app.use('/api/transactions', transactionRoutes)
const contributionRoutes = require('./routes/contributionRoutes')
app.use('/api/contributions', contributionRoutes)
const paymentRoutes = require("./routes/paymentRoutes");
app.use("/api/payments", paymentRoutes);
const anomalyRoutes = require('./routes/anomalyRoutes')
app.use('/api/anomalies', anomalyRoutes)
const exportRoutes = require('./routes/exportRoutes');
app.use('/api/export', exportRoutes);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
