const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const UserSchema = new Schema({
  // username: { type: String, required: true, validate: /^[Aa]\d*$/ },
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  avatar: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  firstname: {
    type: String,
    required: false
  },
  lastname: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: true
  },
  friends: {
    type: Array,
    required: true
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);