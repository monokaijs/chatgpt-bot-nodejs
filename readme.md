# ChatGPT Bot with NodeJs
Author: [@monokaijs](https://monokaijs.com)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fmonokaijs%2Fchatgpt-bot-nodejs)

### Note:
⚠️ Warning: Vercel only provides you 10 secs for processing "function" (it means your bot only have
10 seconds to response to the user), but OpenAI platforms often takes about 20 secs to process a request.
This may lead your bot to not replying incoming messages. To resolve this, you can
use another platform that allow a longer function processing time or upgrade to a higher plan on Vercel.

Another side note is that using English in conversation will significant improve the response time from OpenAI. Be noticed!

This project can be run both using NodeJs or NextJs. I've tried to migrate this application
for you to deploy it onto Vercel Platform without any obstacles.

In NodeJs mode, the application will run a Telegram Bot Instance using Polling Mode, while for Vercel,
it must be a webhook to achieve the goal.

Overall, it's quite easy to migrate this application to another platforms: Discord, Messenger, ... or whatever messaging
platform you like, as long as it allows us to send/receive messages via APIs. I will talk about this further
in another project or a deeper fork of this product. However, today, let's focus on Telegram first.

### Setup
Clone this repository:
```shell
git clone https://github.com/monokaijs/chatgpt-bot-nodejs
```
Then install the dependencies:
```shell
cd ./chatgpt-bot-nodejs
yarn install
```
And then, run the command to run application in `develoment` mode:
```shell
nodemon app.js
```

**DO NOT FORGET** to add environment variables via `.env` file:
```textmate
OPENAI_KEY=<API Key you taken from OpenAI platform>
MONGO_URI=<Put MongoDB URI here>
TELEGRAM_KEY=<Put Telegram Bot Token here>
```

### Changelog
##### Feb 14, 2023 - Implemented NextJs
In this version, I have added support for Vercel deployment using Next.Js. This will enable you to use Vercel's platform
to deploy this chatbot without having to set up your own server.

### Tutorials
See the tutorial behind this bot here:
- [Tutorial in Vietnamese](docs/tutorials.vi.md)
- [Tutorials in English](docs/tutorials.en.md)
