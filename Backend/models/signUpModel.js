const mongoose = require('mongoose');

const signUpSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  age: Number,
  contact: String,
  sex: String,
  photo_name: String,
  comments: [String],
  toBeShown: { type: Boolean, default: true }
});

module.exports = mongoose.model('SignUp', signUpSchema);
