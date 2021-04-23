import { Client } from "discord.js";
import debuggerLog from "./utils/debuggerLog.mjs";
import gameManager from "./actions/gameManager.mjs";
import { sendHelpMessage } from "./messageService.mjs";
import sendErrorMessage from "./utils/bot/sendErrorMessage.mjs";
import ytdl from "ytdl-core-discord";

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
  else if (message.content.startsWith(`${config.prefix}play`)) {
    if (!message.member.voice.channel) {
      message.channel.send("You need to be in a voice channel to play music!");
    }

    const permissions = message.member.voice.channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      message.channel.send("I need the permissions to join and speak in your voice channel!");
    }

    const connection = await message.member.voice.channel.join();
    const dispatcher = await connection
      .play(await ytdl("https://www.youtube.com/watch?v=rTJjtSP-ORc", { highWaterMark: 2000, bitrate: 96, volume: false, quality: "highestaudio" }), { type: 'opus' })
      .on("start", async () => {

      })
      .on("finish", async () => {
        // await message.channel.send(`The song was : ${song.url}`);
        // leaveVoiceChannel(message);
        // Nouvelle boucle
      })
      .on("error", error => {
        debuggerLog(new Date, "Error - playTrack", error);
      });
    return;
  }
  else {
    sendErrorMessage(message.channel, "You need to enter a valid command !");
  }
});

client.login(process.env.YU_TOKEN || config.token);
