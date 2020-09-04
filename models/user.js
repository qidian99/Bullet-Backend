const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  pid: { type: String, required: true, validate: /^[Aa]\d*$/ },
  password: { type: String, required: false }
});

module.exports = mongoose.model('User', UserSchema);