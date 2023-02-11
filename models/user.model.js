const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  telegramId: String
});

const User = mongoose.model('User', schema);

module.exports = User;
