const { Client } = require ("discord.js");
const { debuggerLog } = require ("./utils/debuggerLog");
const { gameManager } = require ("./actions/gameManager");
const { sendHelpMessage } = require ("./messageService");
const sendErrorMessage = require ("./utils/bot/sendErrorMessage");

const client = new Client();
const config = { prefix: "!" };

client.once("ready", () => {
  debuggerLog(new Date(), "index", "Client ready");
});

client.on("message", async message => {
  if (message.author.bot) {
    return;
  }
  if (!message.content.startsWith(config.prefix)) {
    return;
  }
  else if (message.content.startsWith(`${config.prefix}yu`)) {
    sendHelpMessage(message)
    return;
  }
  else if (message.content.startsWith(`${config.prefix}g`)) {
    gameManager(message)
    return;
  }
  else {
    sendErrorMessage(message.channel, "You need to enter a valid command !");
  }
});

client.login(process.env.YU_TOKEN || config.token);
