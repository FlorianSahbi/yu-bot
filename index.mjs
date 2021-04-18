import { Client } from "discord.js";
import initGame from "./actions/initGame.mjs";

const client = new Client();
const config = { prefix: "!" };

client.once("ready", () => {
  console.log(`${Date.now()} : Ready`)
});

client.once("reconnecting", () => {
});

client.once("disconnect", () => {
});

client.on("message", async message => {
  if (message.author.bot) {
    return;
  }
  if (!message.content.startsWith(config.prefix)) {
    return;
  }
  else if (message.content.startsWith(`${config.prefix}g`)) {
    initGame(message)
    return;
  }
  else {
    message.channel.send("You need to enter a valid command!");
  }
});

client.login(process.env.YU_TOKEN || config.token);
