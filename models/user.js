const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  // username: { type: String, required: true, validate: /^[Aa]\d*$/ },
  username: { type: String, required: true },
  password: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);