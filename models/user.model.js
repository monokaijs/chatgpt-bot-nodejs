const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  telegramId: String
});

const User = mongoose.models.User || mongoose.model('User', schema);

module.exports = User;
