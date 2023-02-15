import DbService from "../../services/db.service";
import TelegramService from "../../services/telegram.service";

export default async function handler(req, res) {
  await DbService.connect();
  TelegramService.register();
  console.log('Telegram registered');

  const vercelUrl = process.env.VERCEL_URL;
  const webhookPath = vercelUrl ? `https://${vercelUrl}/api/telegram-webhook` : `https://${req.headers.host}${req.url}`;
  if (req.method === 'GET') {
    TelegramService.bot.setWebHook(webhookPath).then(() => {
      res.json({
        message: 'Telegram Webhook has been successfully set'
      });
    }).catch((e) => {
      console.log(e);
      res.json({
        message: 'Failed to setup Telegram Webhook'
      })
    });
  } else {
    const {body} = req;
    const msg = body.message;
    await TelegramService.responseToMessage(msg);
    return res.json({
      success: true
    });
  }
}
