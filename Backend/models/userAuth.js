const mongoose = require('mongoose');

const userAuthSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});


const authConnection = mongoose.createConnection('mongodb://localhost:27017/authDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = authConnection.model('UserAuth', userAuthSchema);
