const express = require("express");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoute");
const protect = require("./middleware/authMiddleware");
const postRoutes = require("./routes/postRoute");
const userRoutes = require("./routes/userRoute");
const storyRoutes = require("./routes/storyRoute");

const connectDB = require("./config/db");

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
app.use("/api/stories", storyRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to Wanderly ✈️ by ALisha Tamboli"
    });
});

app.get("/api/profile", protect, (req, res) => {
    res.json({
        message: "You are logged in!",
        userId: req.userId
    });
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Wanderly server running on port ${PORT}`);
});