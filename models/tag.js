const mongoose = require('mongoose');
const { Schema } = mongoose;

const TagSchema = new Schema({
  name: { type: String, required: true },
  count: { type: Number, required: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Tag', TagSchema);