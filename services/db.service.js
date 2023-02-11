const mongoose = require('mongoose');
const User = require('../models/user.model');
const Message = require('../models/message.model');

class DbService {
  connection;
  async connect() {
    mongoose.set('strictQuery', true);
    this.connection = await mongoose.connect(process.env.MONGO_URI);
    console.log('DB connected');
  }
  async getUserByTelegramId(telegramId) {
    // thử tìm trong Database
    let user = await User.findOne({
      telegramId,
    });
    if (!user) {
      // Nếu chưa có thì tạo mới một user dựa trên Telegram ID
      user = await User.create({
        telegramId,
      });
    }
    return user;
  }
  async getUserMessages(userId) {
    // Nhớ rằng cái userId này không phải là TelegramID
    return Message.find({
      user: userId
    });
  }
  async createNewMessage(user, userMessage, botMessage) {
    // Lưu tin nhắn vào Database
    return Message.create({
      user: user._id,
      userMessage,
      botMessage,
    })
  }
  async clearUserMessages(userId) {
    // Xoá các tin nhắn của người dùng trong Database
    return Message.deleteMany({
      user: userId
    });
  }
}

module.exports = new DbService();
