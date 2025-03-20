
const { getAllAnomalies, getAnomalyById, addAnomaly, deleteAnomaly } = require("../controllers/anomalyController");
const { protect, admin } = require("../middlewares/authMiddleware");
const router = express.Router();

// Fetch all detected anomalies
router.get("/",protect,admin, getAllAnomalies);

// Fetch a single anomaly by ID
router.get("/:id",protect,admin,  getAnomalyById);

// Add a new anomaly
router.post("/",protect,admin,  addAnomaly);

// Delete an anomaly by ID
router.delete("/:id",protect,admin,  deleteAnomaly);

module.exports = router;
