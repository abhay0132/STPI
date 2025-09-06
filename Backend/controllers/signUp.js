const signUpModel = require("../models/signUpModel");  // ✅ Use only this import
const bcrypt = require("bcrypt");
const path = require("path");

// ✅ GET all visible users
exports.getUserData = async (req, res) => {
  try {
    const users = await signUpModel.find({ toBeShown: true });
    console.log(users);
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// ✅ GET user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await signUpModel.findById(req.params.id);
    if (!user || !user.toBeShown) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.postUserData = async (req, res) => {
  try {
    console.log("✅ Form submission received");
    console.log("req.body:", req.body);
    console.log("req.file:", req.file);

    const {
      name,
      email,
      password,
      age,
      contact,
      sex,
      comments
    } = req.body;

    if (!name || !email || !password || !age || !contact || !sex) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newEntry = new signUpModel({
      name,
      email,
      password,
      age,
      contact,
      sex,
      photo_name: req.file?.filename || null,
      comments: JSON.parse(comments),
    });

    await newEntry.save();
    res.status(201).json({ message: "Form data saved successfully." });

  } catch (err) {
    console.error("❌ Error in postUserData:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// ✅ DELETE (soft delete user)
exports.deleteUserData = async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User ID is required for deletion." });
  }

  try {
    const result = await signUpModel.updateOne(
      { _id: id },
      { $set: { toBeShown: false } }
    );

    if (result.acknowledged && result.modifiedCount > 0) {
      console.log(`✅ Soft deleted user with id: ${id}`);
      res.status(200).json({ message: "User deleted successfully" });
    } else if (result.matchedCount === 0) {
      console.warn(`⚠️ User not found for id: ${id}`);
      res.status(404).json({ message: "User not found" });
    } else {
      console.warn(`⚠️ No changes made for id: ${id}`);
      res.status(400).json({ message: "User could not be deleted" });
    }
  } catch (err) {
    console.error("❌ Error during user deletion:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message,
    });
  }
};

// ✅ PUT (update user)
exports.updateUserData = async (req, res) => {
  try {
    const id = req.params.id;
    const updateData = req.body;

    if (req.file) {
      updateData.photo_name = req.file.filename;
    }

    if (updateData.comments && typeof updateData.comments === "string") {
      try {
        updateData.comments = JSON.parse(updateData.comments);
      } catch (e) {
        updateData.comments = [];
      }
    }

    const updatedUser = await signUpModel.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
