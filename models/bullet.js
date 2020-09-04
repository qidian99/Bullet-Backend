const mongoose = require('mongoose');
const { Schema } = mongoose;

const BulletSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
  timestamp: { type: Number, required: true },
  content: { type: String, required: true },
});

module.exports = mongoose.model('Bullet', BulletSchema);