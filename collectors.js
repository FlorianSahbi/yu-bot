const { differenceInSeconds } = require("date-fns");
const { debuggerLog } = require("./utils/debuggerLog");

const {
  updateAndAdd,
  updateGameWithTags,
  addRank
} = require("./dataService");

const {
  getPoints,
} = require("./utils");

////////////////
// COLLECTORS //
////////////////

exports.attachMessageCollectorJoin = async (joinMessage, message, game) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorJoin", "Start");
  return new Promise(async (resolve, reject) => {
    const filter = (reaction, user) => (reaction.emoji.name === "👍" && !user.bot) || ((reaction.emoji.name === "✅" || reaction.emoji.name === "🚫") && !user.bot && user.id === message.author.id);
    const joinMessageCollector = await joinMessage.createReactionCollector(filter);

    joinMessageCollector.on('collect', (reaction) => {
      if (reaction.emoji.name === "✅" || reaction.emoji.name === "🚫") {
        joinMessageCollector.stop();
      }
    })

    joinMessageCollector.on('end', async (collected) => {
      if (collected.firstKey(1)[0] === "✅") {
        message.channel.send("Can't start a game with no one in it - Game cancel");
        resolve(false);
      }
      if (collected.firstKey(2).includes("✅")) {
        await updateAndAdd(collected, game._id)
        resolve(true);
      } else if (collected.firstKey(2).includes("🚫")) {
        resolve(false);
      }
    })

  })
}

exports.attachMessageCollectorTags = async (tagsMessage, message, game, tags) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorTags", "Start");
  return new Promise(async (resolve, reject) => {
    const filter = m => !m.author.bot && m.author.id === message.author.id;
    const tagsMessagecollector = tagsMessage.channel.createMessageCollector(filter, { time: 30000 });

    tagsMessagecollector.on('collect', async (message) => {
      if (tags.map(({ name }) => name).includes(message.content)) {
        // await sendValidationMessage(message, tags.find(({ name }) => name === message.content));
        await tagsMessagecollector.stop();
      } else {
        message.reply(`${message.content} does not exist`);
      }
    });

    tagsMessagecollector.on('end', async (collected) => {
      resolve(await updateGameWithTags(game._id, tags.filter(({ name }) => name === collected.first().content).map(({ _id }) => _id)))
    });
  });
}

exports.attachMessageCollectorRecap = async (recapMessage, message) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorSongPlaying", "Start");
  return new Promise(async (resolve, reject) => {
    const filter = (reaction, user) => (reaction.emoji.name === "✅" || reaction.emoji.name === "🚫") && !user.bot && user.id === message.author.id;
    const recapMessageCollector = recapMessage.createReactionCollector(filter, { max: 1 });

    recapMessageCollector.on('collect', (reaction) => {
      if (reaction.emoji.name === "✅" || reaction.emoji.name === "🚫") {
        recapMessageCollector.stop();
      }
    })

    recapMessageCollector.on('end', async (collected) => {
      if (collected.firstKey() === "✅") {
        resolve(true);
      } else if (collected.firstKey() === "🚫") {
        resolve(false);
      }
    })
  })
}

exports.attachMessageCollectorSongPlaying = async (round, songPlayingMessage, message, game, dispatcher, song, startTime, position, usersWithAnswer) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorSongPlaying", "0");
  return new Promise(async (resolve, reject) => {
    const alreadyFindAnswer = (message, usersWithAnswer) => usersWithAnswer.includes(message.author.id);
    const filter = (m) => !m.author.bot // Improve attachMessageCollectorSongPlaying players in game not other
    const songPlayingMessageCollector = songPlayingMessage.channel.createMessageCollector(filter, { time: game.trackTime });

    songPlayingMessageCollector.on('collect', async (message) => {
      if (song.answers.includes(message.content) && !alreadyFindAnswer(message, usersWithAnswer)) {
        message.delete()
        message.reply(`got it`);
        await addRank(game._id, round, position, game.users.find((user) => user.discordData.id === message.author.id)._id, getPoints(position) + -(differenceInSeconds(new Date(), startTime) - (game.trackTime / 1000)));
        position = position + 1;
        usersWithAnswer = [...usersWithAnswer, message.author.id];
      } else if (song.answers.includes(message.content) && alreadyFindAnswer(message, usersWithAnswer)) {
        message.delete();
        message.reply("you already found it");
      }
    });

    songPlayingMessageCollector.on('end', async () => {
      dispatcher.end();
    });
  })
}
