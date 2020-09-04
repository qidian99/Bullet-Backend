const mongoose = require('mongoose');
const { Schema } = mongoose;

const BulletSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  roomId: { type: Schema.Types.ObjectId, ref: 'Room', required: false }, // False for testing purposes
  timestamp: { type: Number, required: true },
  content: { type: String, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bullet', BulletSchema);