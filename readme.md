---
layout: Post
title: "Hướng dẫn làm Chatbot GPT cho Telegram"
description: Hướng dẫn cách làm Chatbot GPT cho Telegram đơn giản và dễ hiểu sử dụng NodeJs - JavaScript
date: '2023-02-11'
tags:
- sharing
  images:
- src: /photos/library-preview.jpg
  alt: image alt attribute
---

Đợt này thấy mọi người bàn tán nhiều về ChatGPT quá, nên mình cũng mò mò thử nghịch coi làm được gì. Tình cờ phát hiện một số ý tưởng rất hay, thế nên viết một bài loa qua hướng dẫn mọi người cách để có thể tạo ra một con Chatbot trả lời "thông minh" như ChatGPT.

Về cơ bản, chúng ta sẽ sử dụng OpenAI Platform và dùng JavaScript (NodeJs) để viết phần xử lí. Yêu cầu kỹ thuật của ứng dụng này không cao, độ khó cũng chỉ ở mức trung bình, thế nên mình nghĩ rằng ai cũng có thể thử làm và làm được :>

#### Chuẩn bị
Sẽ cần một số thứ sau đây mà bạn cần chuẩn bị trước:
- Một MongoDB Database sẵn hoặc một tài khoản đã đăng ký [MongoDB Atlas](https://mongodb.com). Bạn có thể đăng ký mới một tài khoản ở đây nếu chưa có.
- Tài khoản Telegram.
- Máy tính được cài sẵn NodeJs (version 16 trở lên).
- Một tài khoản trên nền tảng [OpenAI](https://openai.com). Nếu bạn chưa có tài khoản thì mình không thể giúp bạn khoản này, bạn có thể tham khảo các hướng dẫn tạo tài khoản trên các trang khác :v
- Một tâm hồn đẹp và 1 cốc cà phê.

### Các bước thực hiện
Để tóm gọn lại nội dung của bài viết cũng như chỉ tập trung vào các nội dung chính, mình sẽ lược bỏ hướng dẫn chi tiết các bước sau mà các bạn nên tự tìm hiểu, nếu có vấn đề, feel free to contact:
- Cài đặt sẵn NodeJs (version 16 trở lên) ở local.
- Tạo tài khoản MongoDB Atlas hoặc tự dựng một server MongoDB local, tuỳ ý, miễn sao lấy được Connection URI là được.
- Tạo tài khoản OpenAI nếu chưa có, đăng nhập vào tài khoản OpenAI và truy cập Link sau để lấy API Key. Vào [Link này](https://cran.r-project.org/web/packages/openai/readme/README.html), đọc nội dung mục **Authentication** í.
- Tạo một con chatbot bằng [@BotFather](https://t.me/botfater) trên Telegram và lấy cái key của con bot đó.

##### 1. Khởi tạo Project
Vì mình sẽ hướng dẫn từ đầu nên sẽ cố gắng chi tiết nhất có thể. Đầu tiên, hãy tạo một thư mục cho project, ví dụ:
```sh
cd ~
mkdir chatbot-gpt/
cd ./chatbot-gpt
```
Sau đó, chạy đoạn lệnh sau để khởi tạo `package.json`:
```sh
npm init
```
Nó sẽ hỏi các bạn một số câu hỏi linh tinh, cứ `Enter`, `Enter` và `Enter` liên tục tới khi nào nó không thèm hỏi nữa thì thôi. Ở lúc này, các bạn đã có thể bắt đầu cài các NPM Packages vào.
Chạy lệnh sau để cài các dependencies cần thiết:
```sh
npm i openai dotenv node-telegram-bot-api nodemon mongoose
```
Ok, thời điểm này là bắt đầu code được rồi. Khá đơn giản thôi, đầu tiên chúng ta sẽ tạo 1 file lấy tên là `.env`, đây là file chứa các biến môi trường cho ứng dụng. Nội dung của file `.env`:
```
OPENAI_KEY=<Nhập key lấy từ OpenAI ở đây>
MONGO_URI=<Nhập Mongo Connection URI tại đây>
TELEGRAM_KEY=<Nhập key của con bot telegram>
```
Ok, tạo xong cái file Environment này là coi như xong phần config cơ bản.
##### 2. Cấu trúc Project
Mình ở rất bừa nhưng code thì luôn luôn cần gọn gàng, thế nên mình sẽ chia cấu trúc thư mục và cấu trúc files như sau cho bạn dễ hình dung và tham khảo. Tất nhiên việc bố trí như nào là tuỳ bạn, tuy nhiên nếu bố trí tốt, sau này tới lúc dự án phình to ra thì code sẽ dễ kiểm soát hơn và cũng đỡ mất công tìm file hơn.
```
~/chatbot-gpt/
└── node_modules/
└── services/
│     telegram.service.js
│     chatgpt.service.js
│     db.service.js
└── models/
│     user.model.js
│     message.model.js
└── app.js
```
Ok, cấu trúc cơ bản là như vậy. Sẽ có nhiều chi tiết hơn nếu như đây là một dự án phức tạp, tuy nhiên nếu chỉ dừng ở mức độ một tutorial nhỏ để giới thiệu với các bạn, mình sẽ chọn phương án đơn giản và nhanh gọn nhất.

Như vậy, trên tinh thần cái sơ đồ cấu trúc trên, các bạn sẽ phải tạo file tương ứng. Trong quá trình code, sẽ có một số file nữa được tạo ra như `package-lock.json` hoặc `yarn.lock` (nếu như bạn dùng yarn), hay `.env`, những cái đó mình không đưa vào cấu trúc, chúng ta ngầm hiểu nó có tồn tại.

##### 3. Xuống tay code
Đầu tiên, thứ chúng ta cần làm là tạo được con chatbot telegram cái đã. Việc này có thể được thực hiện bằng cách cho nội dung sau vào app.js
```js
// Config các biến môi trường
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const telegramToken = process.env.TELEGRAM_KEY;

// Khởi tạo con Bot từ Token với chế độ Polling
const bot = new TelegramBot(telegramToken, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;       // ID của cuộc trò chuyện hiện tại
  const chatMsg = msg.text;         // Nội dung của tin nhắn đã nhận
  // Nhại lại nội dung tin nhắn
  bot.sendMessage(chatId, chatMsg);
});
```
Quay lại với terminal, gõ lệnh sau để chạy thử:
```
node app.js
```
Sau khi nhấn Enter, thử nhắn cho con bot Telegram của bạn. Nếu nó trả lời lại thì là ok rồi.

<p align="center">
    <img alt="Telegram Preview" src="https://i.imgur.com/WFF3tLO.png"/>
</p>

Như hình trên, có thể thấy nhắn cái gì là nó trả lời ngược y như vậy. Cơ bản con bot Telegram đã hoạt động ok, bây giờ chúng ta sẽ phải ghép OpenAI vào để có thể "tìm tới sự thông minh".

Để làm được điều này, có khá nhiều cách, tuy nhiên ở đây mình sẽ lựa chọn việc tạo một Service riêng cho vụ trả lời. Tại sao lại vậy?

Thực ra, việc code hết trong 1 file cũng không phải là ý tồi nếu xét tới việc mình đang viết một cái tutorial nhỏ, tuy nhiên nó sẽ là không hợp lí nếu như bạn có nhu cầu muốn tận dụng source code được sinh ra từ bài viết này cho các mục đích lâu dài hơn. Vậy nên, hãy coi như chúng ta đang viết một cái đồ án với yêu cầu chỉnh chu cả trong cấu trúc.

Dưới đây là nội dung của ChatGPT Service:

```js
// File path: ./services/chatgpt.service.js
const {Configuration, OpenAIApi} = require("openai");

class ChatGPTService {
  async generateCompletion(prompt) {
    // Load key từ file environment
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_KEY,
    });
    const openai = new OpenAIApi(configuration);
    // Gửi request về OpenAI Platform để tạo text completion
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    // Đoạn regex ở cuối dùng để loại bỏ dấu cách và xuống dòng dư thừa
    return completion.data.choices[0].text.replace(/^\s+|\s+$/g, "");
  }
}

module.exports = new ChatGPTService();
```

Bây giờ quay lại file app.js, import cái ChatGPTService vào và gọi thử method `generateCompletion` để coi nó trả lời như nào. Nội dung file app.js bây giờ như sau:

```js
// File path: ./app.js

// Config các biến môi trường
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const ChatGPTService = require('./services/chatgpt.service');

const telegramToken = process.env.TELEGRAM_KEY;

// Khởi tạo con Bot từ Token với chế độ Polling
const bot = new TelegramBot(telegramToken, {polling: true});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;       // ID của cuộc trò chuyện hiện tại
  const chatMsg = msg.text;         // Nội dung của tin nhắn đã nhận
  // Nhại lại nội dung tin nhắn
  ChatGPTService.generateCompletion(chatMsg).then(responseMsg => {
    bot.sendMessage(chatId, responseMsg);
  });
});
```

##### 3. Dừng một nhịp - Nodemon
Khoan đã, đáng ra mình sẽ kêu bạn quay lại Terminal, nhấn `Ctrl` + `C` để tắt lệnh đang chạy đi và chạy lại `node app.js` để khởi động lại. Tuy nhiên, bạn có thấy rằng mỗi khi sửa files, bạn lại phải quay đi quay lại chỉ để khởi động lại cái app này?

Vậy nên, giờ chúng ta sẽ tới với nodemon, thứ sẽ tiết kiệm khá nhiều thời gian và công sức.

Giới thiệu sơ qua về nodemon thì đây là một công cụ giúp cho chúng ta đỡ mất công phải khởi động lại ứng dụng mỗi khi thay đổi code. Nói ngắn gọn, mỗi khi chúng ta thay đổi code, nodemon sẽ giúp ta khởi động lại ứng dụng. Cái hay của thằng nodemon là ở chỗ bạn có thể chạy nodemon bằng cách thay `node` trong các câu lệnh thành `nodemon`.

ở đây, để tiếp tục, chúng ta sẽ sử dụng lệnh:
```sh
nodemon app.js
```
Ok, thế là xong.

> ⚠️ Lưu ý, các bạn có thể gặp phải lỗi khi chạy lệnh trên. Nếu gặp lỗi, thử lệnh sau:
> ```sh
> npx nodemon app.js
> ```

Nếu không có vấn đề gì thì chúng ta tiếp tục.

##### 4. Tiếp tục
Quay lại với cuộc trò chuyện Telegram hồi nãy, nếu bây giờ bạn nhắn hỏi nó một câu gì, chắc chắn nó đã biết cách để trả lời bạn:

<p align="center">
	<img src="https://i.imgur.com/1kMA8ey.png" alt="Telegram preview"/>
</p>

Tất nhiên, đây chưa phải là kết quả chúng ta muốn vì nó trả lời rất vu vơ. Ngay bây giờ, mình sẽ giải thích cho bạn lí do tại sao nó lại trả lời ngu và làm sao để có thể cải thiện vấn đề này.

##### 5. OpenAI Text Completion & Conversations
Kỳ thực, cái API mà chúng ta đang dùng có tên là `Text Completion`. Trên trang Docs của OpenAI, Text completion được mô tả ngắn gọn như sau:
> The completions endpoint can be used for a wide variety of tasks. It provides a simple but powerful interface to any of our models. You input some text as a prompt, and the model will generate a text completion that attempts to match whatever context or pattern you gave it. For example, if you give the API the prompt, "As Descartes said, I think, therefore", it will return the completion " I am" with high probability.

Dịch một cách sơ bộ, thì text completion - thứ mà chúng ta đang sử dụng, có thể được sử dụng để giải quyết nhiều vấn đề khác nhau, nếu chúng ta đưa cho hệ thống một đoạn văn bản thì nó sẽ cố gắng đưa thêm thông tin khớp với các nội dung mà chúng ta đưa cho nó. Để mà nói chính xác, bản chất việc chúng ta hỏi sau đấy nó trả lời thực ra là nó đang cố "complete" đoạn text (prompt) mà chúng ta nhắn tới.

Để mà hiểu rõ vấn đề này, bạn cần biết rằng nếu không đưa con chatbot vào một môi trường cụ thể, nó sẽ trả lời một cách rất ngẫu nhiên và "thiểu năng", chứ không thể nào thông minh được. Mình đã gặp phải vấn đề này trong những lần thử nghiệm đầu tiên với nền tảng của OpenAI, và từng kết luận rằng text completion không dùng làm chatbot được. Tuy nhiên, sau khi tham khảo một vài projects khác, mình đã hiểu vấn đề và tìm ra được mấu chốt.

**Nếu chúng ta hỏi đơn thuần, con bot sẽ trả lời rất máy móc như một lẽ dĩ nhiên. Vậy nếu chúng ta đưa con bot vào một "bối cảnh" cuộc trò chuyện thì sao?**

Hãy lưu ý vấn đề này, vì nó sẽ là thứ quyết định chất lượng, nội dung, thông tin cũng như "mức độ thông minh" của con bot bạn đang tạo ra. Chính vì vậy, trước khi chúng ta bắt đầu, hãy cho nó một "lý tưởng" để đi theo =)) Tất nhiên bạn có thể đưa những triết lý của Mác - Lê nin vào, nhưng nó là quá sức tưởng tượng với một con bot :V

Okay, mình đã có tham khảo một số nơi, theo đó cách thông thường nhất mà mọi người sử dụng, đó là giả lập prompt được gửi về Open AI là nội dung một cuộc trò chuyện. Nó sẽ có cấu trúc như sau:

```text
[Roleplay introduction]

User: User message 1.
Bot: Bot replied message 1.

User: User message 2.
Bot: 
```
Lưu ý, cái chỗ để trống ở đoạn tin nhắn cuối cùng rất quan trọng vì **Chúng ta đang sử dụng Text Completion**. Điều đó có nghĩa rằng chúng ta đang yêu cầu con bot điền vào chỗ trống đó.

Một lưu ý nữa, mình có để đoạn `[Roleplay introduction]`, chỗ này chính là chỗ bạn điền chức năng / nhiệm vụ chính mà con bot đảm nhiệm để đảm bảo context mà bạn đưa cho con bot sẽ không bị lệch lạc. Ví dụ như nếu bạn muốn nó chỉ trả lời các vấn đề về chính trị xã hội, hãy bảo nó đóng vai một chính trị gia, nếu bạn muốn nó nói một cách chuyên nghiệp theo hướng kỹ thuật thì bảo nó làm kỹ sư, ... Đại khái thế.

Trong ví dụ dưới đây, mình sẽ lấy trường hợp rằng mình đang cần một người bạn để tâm sự, người bạn đó là một người rất am hiểu về cuộc sống, xã hội, các sự kiện chính trị, các vấn đề thời sự cũng như sẵn sàng đáp ứng mọi yêu cầu của mình, sẵn sàng lắng nghe và đề cao vai trò và cảm xúc của mình khi trò chuyện.

Đây là một mẫu `Roleplay introduction` có thể thử:

```
Trong vai một chatbot chuyên gia với tên là Bot ngáo, nhiệm vụ chính của bạn là tâm sự với người dùng như một người am hiểu về cuộc sống, xã hội, các sự kiện chính trị, các vấn đề thời sự cũng như sẵn sàng đáp ứng mọi yêu cầu của người dùng, sẵn sàng lắng nghe và đề cao vai trò và cảm xúc của người dùng khi trò chuyện. Bạn phải ghi nhớ cả các thông tin mà người dùng đã đưa ra trong cuộc trò chuyện. Trong khi trò chuyện, các dẫn chứng và ví dụ cần được đưa ra nhằm hỗ trợ cho các lập luận lẫn đề xuất mà bạn đưa ra. Lưu ý phải luôn giữ cuộc trò chuyện vui vẻ và thoải mái.
```

Mình sẽ thử đưa vào code thử đoạn này để xem hiệu quả tới đâu.

```js
// File path: ./services/chatgpt.service.js
const {Configuration, OpenAIApi} = require("openai");

class ChatGPTService {
  rolePlayIntroduction = 'Trong vai một chatbot chuyên gia với tên là Bot ngáo, nhiệm vụ chính của bạn là tâm sự với người dùng như một người am hiểu về cuộc sống, xã hội, các sự kiện chính trị, các vấn đề thời sự cũng như sẵn sàng đáp ứng mọi yêu cầu của người dùng, sẵn sàng lắng nghe và đề cao vai trò và cảm xúc của người dùng khi trò chuyện. Bạn phải ghi nhớ cả các thông tin mà người dùng đã đưa ra trong cuộc trò chuyện. Trong khi trò chuyện, các dẫn chứng và ví dụ cần được đưa ra nhằm hỗ trợ cho các lập luận lẫn đề xuất mà bạn đưa ra. Lưu ý phải luôn giữ cuộc trò chuyện vui vẻ và thoải mái.';
  async generateCompletion(prompt) {
    // Load key từ file environment
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_KEY,
    });
    const openai = new OpenAIApi(configuration);

    let fullPrompt = this.rolePlayIntroduction + '\n\n';

    fullPrompt += `Người dùng: ${prompt}\n`;
    fullPrompt += `Bot ngáo: `;

    // Gửi request về OpenAI Platform để tạo text completion
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: fullPrompt,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    // Đoạn regex ở cuối dùng để loại bỏ dấu cách và xuống dòng dư thừa
    return completion.data.choices[0].text.replace(/^\s+|\s+$/g, "");
  }
}

module.exports = new ChatGPTService();
```
Quay lại Telegram, thử chat vài phát xem nào.

<p align="center">
	<img src="https://i.imgur.com/cFTKPQW.png" alt="Telegram preview"/>
</p>

Goèo, kết quả xịn hơn mình nghĩ khá nhiều, nó có thể trả lời một cách nghiêm túc hơn, chỉnh chu hơn cũng như nội dung đúng mục tiêu chúng ta đề ra. Bạn có thể để ý sự khác biệt về nội dung ở cùng một câu hỏi mà mình hỏi lúc 4:59 và lúc 5:19, nội dung không chỉ đầy đủ hơn mà cũng logic hơn và thực tế hơn.

Cơ bản tính tới thời điểm hiện tại, chúng ta đã có một con bot "khá khôn", bạn có thể sử dụng con bot này để phục vụ mục đích bản thân, hỏi nó trên trời dưới đất tuỳ ý. Tuy vậy, vẫn còn những điểm mà chúng ta cần khắc phục, cụ thể bạn sẽ không muốn phải giới thiệu bản thân mỗi lần nhắn tin với con bot. Vậy, giải quyết như thế nào?

##### Lưu trữ Context Messages
Quay lại bài toán ở trên, vấn đề ngữ cảnh được đưa vào trong cuộc trò chuyện là rất quan trọng. Vậy nên, để có thể đỡ phải giới thiệu nhiều cũng như con bot có thể theo dõi được cuộc trò chuyện, ngắn gọn là ta sẽ phải đính kèm tất cả các tin nhắn cũ đã nhắn với con bot vào trong prompt gửi lên OpenAI.

Vậy, làm như nào? Đơn giản thôi, lưu tin nhắn lại và load lại mỗi khi trả lời :v

Để làm được điều này, chúng ta sẽ phải có database, thứ mà mình đã nhắc là cần thiết ngay từ đầu. Về phần khởi tạo thì nó khá đơn giản, nội dung sau sẽ là DbService (Database Service):

```js
// File path: ./services/db.service.js
const mongoose = require('mongoose');

class DbService {
  connection;
  async connect() {
    mongoose.set('strictQuery', true);
    this.connection = await mongoose.connect(process.env.MONGO_URI);
    console.log('DB connected');
  }
}

module.exports = new DbService();
```

Tiếp đến là sửa lại file app.js:
```js
// File path: ./app.js
// Config các biến môi trường
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const ChatGPTService = require('./services/chatgpt.service');
const DbService = require('./services/db.service');

const telegramToken = process.env.TELEGRAM_KEY;

DbService.connect().then(() => {
  // Khởi tạo con Bot từ Token với chế độ Polling
  const bot = new TelegramBot(telegramToken, {polling: true});

  bot.on('message', (msg) => {
    const chatId = msg.chat.id;       // ID của cuộc trò chuyện hiện tại
    const chatMsg = msg.text;         // Nội dung của tin nhắn đã nhận
    // Nhại lại nội dung tin nhắn
    ChatGPTService.generateCompletion(chatMsg).then(responseMsg => {
      bot.sendMessage(chatId, responseMsg);
    });
  });
});
```
Quay lại Terminal, nếu bạn chờ một chút và thấy dòng DB connected, có nghĩa là Database đã hoạt động. Còn nếu không thì chắc là bạn sẽ phải tự mò mẫm thôi :v hãy kiểm tra thật kỹ `MONGO_URI` mà bạn đã điền vào file `.env`, vì có thể đó sẽ là vấn đề.

Sau khi chúng ta có được Database connection, điều cần làm tiếp theo là tạo Model cho dữ liệu, do chúng ta đang dùng `mongoose`, vậy nên, bạn sẽ có thể phải search Google một chút do cách hoạt động nó có hơi khác so với mongodb thông thường. Nếu không có gì thắc mắc, keep reading.

Tạo thư mục services như trong cấu trúc thư mục, ở đây ta sẽ phải tạo 2 files là `user.model.js` và `message.model.js`. Đơn giản nên mình sẽ không vẽ ERD, bạn có thể hiểu rằng mỗi khi mọi người nhắn cho con bot, một object user sẽ được tạo ra từ user model. Mỗi user sẽ có thể có nhiều tin nhắn, nên sẽ cần có một tham chiếu từ message object về user object để coi ai là chủ của cái tin nhắn đó (để lúc trả lời tin nhắn còn query nữa chứ sao :=]] ).

```js
// File path: ./models/message.model.js
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  botMessage: String,
  userMessage: String,
});

const Message = mongoose.model('Message', schema);

module.exports = Message;
```
... và user model:
```js
// File path: ./models/user.model.js
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  telegramId: String
});

const User = mongoose.model('User', schema);

module.exports = User;
```

Ok, tiếp đây ta sẽ quay lại để sửa DbService phục vụ cho mục đích xử lí các vấn đề sau:
- Tạo user nếu chưa có.
- Lấy user hiện tại dựa trên Telegram ID.
- Query ra các tin nhắn thuộc một User.

```js
// File path: ./services/db.service.js
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
```

Goèo, tới đây là cũng gần xong rồi đó. Bây giờ chúng ta sẽ quay lại file app.js sửa một chút:
```js
// File path: ./app.js

// Config các biến môi trường
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const ChatGPTService = require('./services/chatgpt.service');
const DbService = require('./services/db.service');

const telegramToken = process.env.TELEGRAM_KEY;

DbService.connect().then(() => {
  // Khởi tạo con Bot từ Token với chế độ Polling
  const bot = new TelegramBot(telegramToken, {polling: true});

  bot.on('message', async (msg) => {
    const authorId = msg.from.id      // Lấy id của người gửi
    const chatId = msg.chat.id;       // ID của cuộc trò chuyện hiện tại
    const chatMsg = msg.text;         // Nội dung của tin nhắn đã nhận
    // Đầu tiên sẽ lấy thông tin user ra
    const user = await DbService.getUserByTelegramId(authorId);
    // Trả lời tin nhắn dựa trên các tin nhắn cũ
    ChatGPTService.generateCompletion(chatMsg, user).then(responseMsg => {
      bot.sendMessage(chatId, responseMsg);
    });
  });
});
```

Và quay lại file chatgpt.service.js để code nốt phần logic xử lí tin nhắn:
```js
// File path: ./services/chatgpt.service.js
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

    let fullPrompt = this.rolePlayIntroduction + '\n\n';

    if (oldMessages && oldMessages.length > 0) {
      // nếu có tin nhắn cũ thì thêm đoạn tin nhắn cũ đấy vào nội dung chat
      for (let message of oldMessages) {
        fullPrompt += `Người dùng: ${message.userMessage}\n`;
        fullPrompt += `Bot ngáo: ${message.botMessage}\n\n`;
      }
    }

    fullPrompt += `Người dùng: ${prompt}\n`;
    fullPrompt += `Bot ngáo: `;

    // Gửi request về OpenAI Platform để tạo text completion
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: fullPrompt,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    // Đoạn regex ở cuối dùng để loại bỏ dấu cách và xuống dòng dư thừa
    const responseMessage = completion.data.choices[0].text.replace(/^\s+|\s+$/g, "");

    // Lưu lại tin nhắn vào Database
    await DbService.createNewMessage(user, prompt, responseMessage);
    return responseMessage;
  }
}

module.exports = new ChatGPTService();
```

Quay lại Telegram thử một phát, và đây là kết quả:
<p align="center">
	<img src="https://i.imgur.com/yV7TSWB.png"/>
</p>

Goào, không biết nói gì hơn. Cơ bản thì nó đã chạy một cách khá khôn rồi. Tuy nhiên nếu để nói rằng khôn hẳn thì chắc là chưa. Dù sao thì đây chỉ là một Tutorial cỡ "vừa vừa" =)) mình không có nhiều cơ hội để giải thích, nếu có thời gian mình sẽ cố làm video cho các bạn.

Còn hiện tại bài viết này cũng đã "rất rất dài" rồi. Mình nghĩ sẽ tạm thời kết thúc ở đây.


Source code: [Nhớ tự làm đi rồi hẵng click vào đây nha](https://github.com/monokaijs/chatgpt-bot-nodejs)

