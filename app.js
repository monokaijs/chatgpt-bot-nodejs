// Config các biến môi trường
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const ChatGPTService = require('./services/chatgpt.service');
const DbService = require('./services/db.service');
const TelegramService = require("./services/telegram.service");

DbService.connect().then(() => {
  // Khởi tạo con Bot từ Token với chế độ Polling
  const bot = TelegramService.register(true);
  // Phản hồi tin nhắn
  bot.on('message', async (msg) => TelegramService.responseToMessage(msg));
});
