const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const BulletSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: false
  }, // False for testing purposes
  source: {
    type: String,
    required: true
  },
  tags: {
    type: Array,
    required: false
  },
  resourceId: {
    type: Schema.Types.ObjectId,
    ref: 'Resource',
    required: true
  },
  timestamp: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Bullet', BulletSchema);