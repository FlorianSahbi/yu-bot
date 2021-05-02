const { differenceInSeconds } = require("date-fns");
const { debuggerLog } = require("./utils/debuggerLog");

const {
  updateAndAdd,
  updateGameWithTags,
  addRank,
  deleteGame,
  updateGuildIsPlaying,
} = require("./dataService");

const { sendErrorMessage } = require("./utils/bot/sendErrorMessage");

const config = require("./index");

const {
  sendValidationMessage,
} = require("./messageService");

const {
  getPoints, leaveVoiceChannel,
} = require("./utils");

////////////////
// COLLECTORS //
////////////////

exports.attachMessageCollectorJoin = async (joinMessage, message, game) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorJoin", "Start");
  return new Promise(async (resolve, reject) => {
    const filter = (reaction, user) => (reaction.emoji.name === "👍" && !user.bot) || ((reaction.emoji.name === "✅" || reaction.emoji.name === "🚫") && !user.bot && user.id === message.author.id);
    const joinMessageCollector = await joinMessage.createReactionCollector(filter, { time: config.config.timeCollectors, errors: ['time'] });

    joinMessageCollector.on('collect', (reaction) => {
      if (reaction.emoji.name === "✅" || reaction.emoji.name === "🚫") {
        joinMessageCollector.stop();
      }
    })

    joinMessageCollector.on('end', async (collected) => {
      if (collected.firstKey(1)[0] === "✅") {
        await deleteGame(game._id)
        await updateGuildIsPlaying(message.guild.id, false);
        await leaveVoiceChannel(message);
        await sendErrorMessage(message.channel, "Game canceled - Can't start a game with no one in it")
        resolve(false);
      }
      if (collected.firstKey(2).includes("✅")) {
        await updateAndAdd(collected, game._id)
        resolve(true);
      } else if (collected.firstKey(2).includes("🚫")) {
        await updateGuildIsPlaying(message.guild.id, false);
        await leaveVoiceChannel(message);
        await sendErrorMessage(message.channel, "Game canceled - The author just end this game")
        resolve(false);
      } else {
        await sendErrorMessage(message.channel, "Game canceled - Time exceeded")
        await joinMessageCollector.stop();
        await updateGuildIsPlaying(message.guild.id, false);
        await deleteGame(game._id)
        await leaveVoiceChannel(message);
        resolve(false)
      }
    })

  })
}

exports.attachMessageCollectorTags = async (tagsMessage, message, game, tags) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorTags", "Start");
  return new Promise(async (resolve, reject) => {
    const filter = m => !m.author.bot && m.author.id === message.author.id;
    const tagsMessagecollector = tagsMessage.channel.createMessageCollector(filter, { time: config.config.timeCollectors, errors: ['time'] });

    tagsMessagecollector.on('collect', async (message) => {
      if (tags.map(({ name }) => name.trim().toLowerCase()).includes(message.content.trim().toLowerCase()) && !message.content.startsWith(`${config.config.prefix}`)) {
        await tagsMessagecollector.stop();
      } else if (message.content.startsWith(`${config.config.prefix}`)) {
        console.log("not good")
      } else {
        message.reply(`${message.content} does not exist`);
      }
    });

    tagsMessagecollector.on('end', async (collected) => {
      if (collected.array().length > 0 && tags.map(({ name }) => name.trim().toLowerCase()).includes(collected.last().content.trim().toLowerCase())) {
        await updateGameWithTags(game._id, tags.filter(({ name }) => name.trim().toLowerCase() === collected.last().content.trim().toLowerCase()).map(({ _id }) => _id))
        resolve(true)
      } else {
        await sendErrorMessage(message.channel, "Game canceled - Time exceeded")
        await tagsMessagecollector.stop();
        await deleteGame(game._id)
        await updateGuildIsPlaying(message.guild.id, false);
        await leaveVoiceChannel(message);
        resolve(false)
      }
    });
  });
}

exports.attachMessageCollectorRecap = async (recapMessage, message, game) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorSongPlaying", "Start");
  return new Promise(async (resolve, reject) => {
    const filter = (reaction, user) => (reaction.emoji.name === "✅" || reaction.emoji.name === "🚫") && !user.bot && user.id === message.author.id;
    const recapMessageCollector = recapMessage.createReactionCollector(filter, { max: 1, time: config.config.timeCollectors, errors: ['time'] });

    recapMessageCollector.on('collect', (reaction) => {
      if (reaction.emoji.name === "✅" || reaction.emoji.name === "🚫") {
        recapMessageCollector.stop();
      }
    })

    recapMessageCollector.on('end', async (collected) => {
      if (collected.firstKey() === "✅") {
        resolve(true);
      } else if (collected.firstKey() === "🚫") {
        await deleteGame(game._id)
        await updateGuildIsPlaying(message.guild.id, false);
        await sendErrorMessage(message.channel, "Game canceled - The author just end this game")
        await leaveVoiceChannel(message);
        resolve(false);
      } else {
        await sendErrorMessage(message.channel, "Game canceled - Time exceeded")
        await recapMessageCollector.stop();
        await deleteGame(game._id)
        await updateGuildIsPlaying(message.guild.id, false);
        await leaveVoiceChannel(message);
        resolve(false)
      }
    })
  })
}

exports.attachMessageCollectorSongPlaying = async (round, songPlayingMessage, message, game, dispatcher, song, startTime, position, usersWithAnswer) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorSongPlaying", "0");
  return new Promise(async (resolve, reject) => {
    const alreadyFindAnswer = (message, usersWithAnswer) => usersWithAnswer.includes(message.author.id);
    const filter = (m) => !m.author.bot // Improve attachMessageCollectorSongPlaying players in game not other
    const songPlayingMessageCollector = songPlayingMessage.channel.createMessageCollector(filter, { time: 30000 });

    songPlayingMessageCollector.on('collect', async (message) => {
      if (song.answers.map((answer) => answer.trim().toLowerCase()).includes(message.content.trim().toLowerCase()) && !alreadyFindAnswer(message, usersWithAnswer)) {
        message.delete()
        message.reply(`got it`);
        await addRank(game._id, round, position, game.users.find((user) => user.discordData.id === message.author.id)._id, getPoints(position) + -(differenceInSeconds(new Date(), startTime) - (game.trackTime / 1000)));
        position = position + 1;
        usersWithAnswer = [...usersWithAnswer, message.author.id];
      } else if (song.answers.map((answer) => answer.trim().toLowerCase()).includes(message.content.trim().toLowerCase()) && alreadyFindAnswer(message, usersWithAnswer)) {
        message.delete();
        message.reply("you already found it");
      }
    });

    songPlayingMessageCollector.on('end', async () => {
      dispatcher.end();
    });
  })
}
