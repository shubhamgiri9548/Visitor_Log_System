const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(express.json());

// Middleware
app.use(cors({
  origin: [
    "https://visitor-log-system-uire.vercel.app" // replace with your actual deployed frontend URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));


// Import Routes
const visitorRoutes = require("./routes/visitorRoutes");

// Use Routes
app.use("/api/visitors", visitorRoutes); // Now all visitor APIs start with /api/visitors

// Default route
app.get("/", (req, res) => {
  res.send("Visitor Management Backend is running...");
});


// Connect to MongoDB
const db = require("./config/db");
db.connect();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
