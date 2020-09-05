const mongoose = require('mongoose');
const {
  Schema
} = mongoose;

const ResourceSchema = new Schema({
  tags: {
    type: Array,
    required: false
  },
  name: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: false
  },
  avatar: {
    type: String,
    required: false
  },
  files: {
    type: Array,
    required: false
  },
  roomId: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: false
  }, // False for testing purposes
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  hidden: {
    type: Boolean,
    require: false
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Resource', ResourceSchema);