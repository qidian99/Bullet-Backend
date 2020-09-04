const mongoose = require('mongoose');
const { Int32 } = require('mongodb');
const { Schema } = mongoose;

const RoomInvitationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: false },
  accepted: { type: Number, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('RoomInvitation', RoomInvitationSchema);