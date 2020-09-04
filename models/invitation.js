const mongoose = require('mongoose');
const { Schema } = mongoose;

const InvitationSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: false },
  accepted: { type: Boolean, required: ture },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Invitation', InvitationSchema);