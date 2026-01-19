const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("./Routes/auth");
const adminRoutes = require("./Routes/adminRoutes");
const scanRoutes = require("./Routes/scan");
const app = express();
const cors = require("cors");
dotenv.config();

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

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    // This will help us see if the string is formatted correctly
    if (!uri || !uri.includes("@")) {
      console.error(
        "❌ ERROR: Your MONGO_URI is incomplete. It must include 'mongodb+srv://username:password@cluster...'"
      );
      process.exit(1);
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB Forest Data Connected...");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🚀 http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ Connection failed:", err.message);
    process.exit(1);
  }
};

connectDB();
