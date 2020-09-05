const mongoose = require('mongoose');
const {
  Int32
} = require('mongodb');
const {
  Schema
} = mongoose;

const FriendInvitationSchema = new Schema({
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accepted: {
    type: Number,
    required: true
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FriendInvitation', FriendInvitationSchema);