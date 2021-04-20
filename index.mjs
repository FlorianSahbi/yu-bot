import { Client } from "discord.js";
import debuggerLog from "./utils/debuggerLog.mjs";
import gameManager, { sendHelpMessage } from "./actions/gameManager.mjs";
import sendErrorMessage from "./utils/bot/sendErrorMessage.mjs";

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
