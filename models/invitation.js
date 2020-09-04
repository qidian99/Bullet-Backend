const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvitationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: false },
  accepted: { type: Boolean, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Invitation', InvitationSchema);