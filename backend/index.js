const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoutes = require("./Routes/auth");
const adminRoutes = require("./Routes/adminRoutes");
const scanRoutes = require("./Routes/scan");
const policyRoutes = require("./Routes/policyRoutes");
const app = express();
const cors = require("cors");

app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token", "x-user-email", "Accept", "Origin"]
}));

const PORT = process.env.PORT || 5000;
app.use(express.json());

// Ensure MongoDB connection is established before route handlers run (essential for serverless like Vercel)
let cachedDbPromise = null;
const ensureDbConnected = async (req, res, next) => {
  if (req.path === "/") return next();
  const uri = process.env.MONGO_URI;
  if (!uri || !uri.includes("@")) {
    console.error("❌ ERROR: MONGO_URI is missing or incomplete.");
    return res.status(500).json({ error: "MONGO_URI is not configured in server environment." });
  }
  if (mongoose.connection.readyState >= 1) {
    return next();
  }
  try {
    if (!cachedDbPromise) {
      cachedDbPromise = mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    }
    await cachedDbPromise;
    next();
  } catch (err) {
    cachedDbPromise = null;
    console.error("❌ Connection failed. Check your MongoDB IP Whitelist:", err.message);
    return res.status(500).json({ 
      error: "Database connection failed", 
      message: "Please check that 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access.",
      details: err.message 
    });
  }
};

app.use(ensureDbConnected);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/scans", scanRoutes);
app.use("/api/policies", policyRoutes);

app.get("/", (req, res) => {
  res.json({ status: "Backend is working", dbState: mongoose.connection.readyState });
});

// Only start the server locally (Vercel will use the exported app)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🚀 http://localhost:${PORT}`);
  });
}

// Export the app for Vercel Serverless
module.exports = app;
