import React from "react";
export default function HomePage() {
  return (
    <div>
      Welcome to ChatGPT Bot. Application has started properly, please head to Telegram Bot and send some message!<br/><br/>
      Click <a href={'/api/telegram-webhook'}>this link</a> to finish setup webhook.
    </div>
  )
}
