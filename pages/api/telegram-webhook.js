import DbService from "../../services/db.service";
import TelegramService from "../../services/telegram.service";

export default async function handler(req, res) {
  const vercelUrl = process.env.VERCEL_URL;
  const webhookPath = `https://${vercelUrl}/api/telegram-webhook`;
  if (req.method === 'GET') {
    if (!vercelUrl) {
      return res.json({
        message: 'Please deploy this project to Vercel first'
      });
    }
    TelegramService.register();
    TelegramService.bot.setWebHook(webhookPath).then(() => {
      res.json({
        message: 'Telegram Webhook has been successfully set'
      });
    }).catch((e) => {
      res.json({
        message: 'Failed to setup Telegram Webhook'
      })
    });
  } else {
    const {body} = req;
    const msg = body.message;
    console.log(msg);
    await DbService.connect();
    TelegramService.register();
    await TelegramService.responseToMessage(msg);
    return res.json({
      success: true
    });
  }
}
