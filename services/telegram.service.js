import TelegramBot from "node-telegram-bot-api";
import DbService from "./db.service";
import ChatGPTService from "./chatgpt.service";

class TelegramService {
  bot;
  constructor() {
  }
  register(polling = false) {
    const telegramToken = process.env.TELEGRAM_KEY;
    this.bot = new TelegramBot(telegramToken, {polling});
    return this.bot;
  }
  async responseToMessage(msg) {
    const authorId = msg.from.id      // Lấy id của người gửi
    const chatId = msg.chat.id;       // ID của cuộc trò chuyện hiện tại
    const chatMsg = msg.text;         // Nội dung của tin nhắn đã nhận
    // Đầu tiên sẽ lấy thông tin user ra
    const user = await DbService.getUserByTelegramId(authorId);
    if (msg.text === '/clear') {
      // Xoá các tin nhắn cũ trong lịch sử
      await DbService.clearUserMessages(user._id);
      return bot.sendMessage(chatId, 'Messages has been cleared');
    }
    // Trả lời tin nhắn dựa trên các tin nhắn cũ
    ChatGPTService.generateCompletion(chatMsg, user).then(responseMsg => {
      bot.sendMessage(chatId, responseMsg);
    });
  }
}

const telegramService = new TelegramService();

export default telegramService;
