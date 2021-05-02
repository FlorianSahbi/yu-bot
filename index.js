const { Client } = require("discord.js");
const { debuggerLog } = require("./utils/debuggerLog");
const { gameManager } = require("./actions/gameManager");
const { sendHelpMessage } = require("./messageService");
const { getGuildByGuildId, updateGuildIsPlaying, createGuild } = require("./dataService");
const { sendErrorMessage } = require("./utils/bot/sendErrorMessage");
const { joinVoiceChannel } = require("./utils");

let timeoutId = null;
const client = new Client();
exports.config = { prefix: "!", timeCollectors: 30000 };
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
    clearTimeout(timeoutId);
    const { guildByGuildId: guild } = await getGuildByGuildId(message.guild.id);
    if (guild?.isPlaying === false || guild?.isPlaying === undefined) {
      await createGuild(message.guild);
      sendHelpMessage(message)
    } else {
      message.channel.send("Your server is already in game, pls end it before")
    }
    return;
  }
  else if (message.content.startsWith(`${config.prefix}j`)) {
    await joinVoiceChannel(message)
  }
  else if (message.content.startsWith(`${config.prefix}g`)) {
    const { guildByGuildId: guild } = await getGuildByGuildId(message.guild.id);
    if (guild?.isPlaying === false || guild?.isPlaying === undefined) {
      await createGuild(message.guild);
      const guild = await updateGuildIsPlaying(message.guild.id, true);
      gameManager(message, guild)
    } else {
      message.channel.send("Your server is already in game, pls end it before")
    }
    return;
  }
  else {
    sendErrorMessage(message.channel, "You need to enter a valid command !");
  }
});

client.login(process.env.YU_TOKEN || config.token);
