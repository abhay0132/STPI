const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const signUpModel = require("../models/signUpModel");
const { authenticateToken } = require("../middlewares/auth");
const UserAuth = require("../models/userAuth");
const userAuth = require("../models/userAuth");



router.get('/check-auth', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ authenticated: true, user: req.session.user });
  } else {
    return res.json({ authenticated: false });
  }
});



// login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserAuth.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "super_duper_secret_key",
      { expiresIn: "1h" }
    );

    res.json({
  message: "Login successful",
  token,
  _id: user._id,
  name: user.name,
  email: user.email
});
  } catch (error) {
    res.status(500).json({ message: "Internal error" });
  }
});

// sign up
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await UserAuth.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserAuth({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Sign up successful" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Error during signup" });
  }
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token'); // Or your session cookie name
  req.session?.destroy(() => {
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
