const mongoose = require("mongoose");

async function connect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/stpi", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB (stpi)");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error);
    process.exit(1);
  }
}

module.exports = connect;
