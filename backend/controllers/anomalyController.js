const Anomaly = require("../models/Anomaly");

// Get all detected anomalies
exports.getAllAnomalies = async (req, res) => {
    try {
        const anomalies = await Anomaly.find().populate("transactionId");
        res.status(200).json(anomalies);
    } catch (error) {
        res.status(500).json({ message: "Error fetching anomalies", error });
    }
};

// Get a single anomaly by ID
exports.getAnomalyById = async (req, res) => {
    try {
        const anomaly = await Anomaly.findById(req.params.id).populate("transactionId");
        if (!anomaly) {
            return res.status(404).json({ message: "Anomaly not found" });
        }
        res.status(200).json(anomaly);
    } catch (error) {
        res.status(500).json({ message: "Error fetching anomaly", error });
    }
};

// Add a new anomaly
exports.addAnomaly = async (req, res) => {
    try {
        const { transactionId, riskScore, detectedBy, notes } = req.body;

        if (!transactionId || !riskScore || !detectedBy) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newAnomaly = new Anomaly({
            transactionId,
            riskScore,
            detectedBy,
            notes
        });

        await newAnomaly.save();
        res.status(201).json({ message: "Anomaly recorded successfully", anomaly: newAnomaly });
    } catch (error) {
        res.status(500).json({ message: "Error adding anomaly", error });
    }
};

// Delete an anomaly by ID
exports.deleteAnomaly = async (req, res) => {
    try {
        const anomaly = await Anomaly.findByIdAndDelete(req.params.id);
        if (!anomaly) {
            return res.status(404).json({ message: "Anomaly not found" });
        }
        res.status(200).json({ message: "Anomaly deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting anomaly", error });
    }
};
