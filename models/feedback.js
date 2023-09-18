const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  textAreaData: {
    type: String,
    required: true,
  },

  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Feedback = mongoose.model('feedback', feedbackSchema);

module.exports = Feedback;
