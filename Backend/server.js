const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const cors = require("cors");
const connectDB = require("./connection/db"); // Correct DB import

const app = express();
const PORT = 6969;

// Connect to MongoDB first
connectDB().then(() => {
  console.log("✅ Connected to MongoDB");

  app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(session({
    secret: "super_duper_secret_key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  }));

  app.use("/uploads", express.static("uploads"));

  const userRoutes = require("./routes/routes");
  const authRoutes = require("./routes/auth");

  app.use("/userData", userRoutes);  // All /userData/* routes
  app.use("/auth", authRoutes);      // All /auth/* routes

  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}).catch((err) => {
  console.error("❌ DB connection failed:", err);
});
