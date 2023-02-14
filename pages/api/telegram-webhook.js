import TelegramBot from "node-telegram-bot-api";

export default function handler(req, res) {
  const vercelUrl = process.env.VERCEL_URL;
  const webhookPath = `https://${vercelUrl}/api/telegram-webhook`;
  if (req.method === 'GET') {
    if (!vercelUrl) {
      return res.json({
        message: 'Please deploy this project to Vercel first'
      });
    }
    const telegramToken = process.env.TELEGRAM_KEY;
    const bot = new TelegramBot(telegramToken, {polling: true});
    bot.setWebHook(webhookPath).then(() => {
      res.json({
        message: 'Telegram Webhook has been successfully set'
      });
    }).catch((e) => {
      res.json({
        message: 'Failed to setup Telegram Webhook'
      })
    });
  } else {
    console.log(req.method + ' request received');
  }
}
