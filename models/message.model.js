const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  botMessage: String,
  userMessage: String,
});

const Message = mongoose.models.Message || mongoose.model('Message', schema);

module.exports = Message;
