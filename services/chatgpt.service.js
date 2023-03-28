const {Configuration, OpenAIApi} = require("openai");
const DbService = require('./db.service');

class ChatGPTService {
  rolePlayIntroduction = 'Trong vai một chatbot chuyên gia với tên là Bot ngáo, nhiệm vụ chính của bạn là tâm sự với người dùng như một người am hiểu về cuộc sống, xã hội, các sự kiện chính trị, các vấn đề thời sự cũng như sẵn sàng đáp ứng mọi yêu cầu của người dùng, sẵn sàng lắng nghe và đề cao vai trò và cảm xúc của người dùng khi trò chuyện. Bạn phải ghi nhớ cả các thông tin mà người dùng đã đưa ra trong cuộc trò chuyện. Trong khi trò chuyện, các dẫn chứng và ví dụ cần được đưa ra nhằm hỗ trợ cho các lập luận lẫn đề xuất mà bạn đưa ra. Lưu ý phải luôn giữ cuộc trò chuyện vui vẻ và thoải mái.';
  async generateCompletion(prompt, user) {
    // Lấy đống tin nhắn cũ ra
    const oldMessages = await DbService.getUserMessages(user._id);

    // Load key từ file environment
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const messages = [{
      role: 'system',
      content: this.rolePlayIntroduction
    }];

    for (let conv of oldMessages) {
      messages.push({
        role: 'user',
        content: conv.userMessage
      });
      messages.push({
        role: 'assistant',
        content: conv.botMessage
      })
    }
    messages.push({
      role: 'user',
      content: prompt
    });

    // Gửi request về OpenAI Platform để tạo text completion
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      user: user?._id.toString(),
      messages,
    });
    // Đoạn regex ở cuối dùng để loại bỏ dấu cách và xuống dòng dư thừa
    const responseMessage = completion.data.choices[0].message.content.replace(/^\s+|\s+$/g, "");

    // Lưu lại tin nhắn vào Database
    await DbService.createNewMessage(user, prompt, responseMessage);
    return responseMessage;
  }
}

module.exports = new ChatGPTService();
