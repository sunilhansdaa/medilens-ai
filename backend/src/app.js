const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const path = require("path");

const healthRoutes = require("./routes/healthRoutes");
const reportRoutes = require("./routes/reportRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const authRoutes = require("./routes/authRoutes");

const { getProfile } = require("./controllers/authController");
const { protect } = require("./middleware/authMiddleware");

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || "http://127.0.0.1:5173",
  "http://localhost:5173",
  "http://127.0.0.1:5173"
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error("Not allowed by CORS"));
    },
    credentials: true
  })
);

app.use(bodyParser.json({ limit: "10mb" }));

app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "10mb"
  })
);

app.use(
  "/uploads",
  express.static(path.resolve(__dirname, "../uploads"))
);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediLens AI API is running"
  });
});

app.use("/api/health", healthRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/reports", reportRoutes);

app.use("/api/history", reportRoutes);

app.get("/api/profile", protect, getProfile);

app.use("/api/medicine", medicineRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    success: false,
    message:
      error.code === 11000
        ? "Duplicate value already exists"
        : error.message || "Internal server error"
  });
});

module.exports = app;