const signUpModel = require('../models/signUpModel');
const jwt = require("jsonwebtoken");
exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await signUpModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const newUser = new signUpModel({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Signup failed:", err);
    res.status(500).json({ message: "Internal server error." });
  }
};


