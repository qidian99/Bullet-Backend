const mongoose = require('mongoose');
const { Schema } = mongoose;

const RoomSchema = new Schema({
  alias: { type: String, required: true }, // The nickname of the room
  users: { type: Array, required: true }, // All the users in the room
  admins: { type: Array, require: true }, // At least one admin for a room
  pending: { type: Array, required: false }, // Pending list for all the users waiting to join the room
  public: { type: Boolean, required: false }, // Whether the room is public or not
  widgets: { type: Array, required: false },
  avatar: { type: String, required: false },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Room', RoomSchema);