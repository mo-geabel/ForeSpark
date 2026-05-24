const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoutes = require("./Routes/auth");
const adminRoutes = require("./Routes/adminRoutes");
const scanRoutes = require("./Routes/scan");
const app = express();
const cors = require("cors");

app.use(cors());

const PORT = process.env.PORT || 5000;
// Add this line with your other middlewares in server.
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/scans", scanRoutes);
app.get("/", (req, res) => {
  res.json({ status: "Backend is working" });
});

// Connect to MongoDB
const uri = process.env.MONGO_URI;
if (!uri || !uri.includes("@")) {
  console.error("❌ ERROR: Your MONGO_URI is incomplete.");
} else {
  // serverSelectionTimeoutMS helps fail fast if Vercel's IP is blocked by MongoDB Atlas
  mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("✅ MongoDB Forest Data Connected..."))
    .catch((err) => console.error("❌ Connection failed. Check your MongoDB IP Whitelist:", err.message));
}

// Only start the server locally (Vercel will use the exported app)
if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🚀 http://localhost:${PORT}`);
  });
}

// Export the app for Vercel Serverless
module.exports = app;
