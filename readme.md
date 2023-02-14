# ChatGPT Bot with NodeJs
Author: [@monokaijs](https://monokaijs.com)

### Note:
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

### Tutorials
See the tutorial behind this bot here:
- [Tutorial in Vietnamese](docs/tutorials.vi.md)
- [Tutorials in English](docs/tutorials.en.md)
