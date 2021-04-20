import { differenceInSeconds } from "date-fns";
import debuggerLog from "./utils/debuggerLog.mjs";

import {
  updateAndAdd,
  updateGameWithTags,
  addRank
} from "./dataService.mjs";

import {
  getPoints,
} from "./utils.mjs";

////////////////
// COLLECTORS //
////////////////

export const attachMessageCollectorJoin = async (joinMessage, message, game) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorJoin", "Start");
  return new Promise(async (resolve, reject) => {
    const filter = (reaction, user) => (reaction.emoji.name === "👍" && !user.bot) || (reaction.emoji.name === "✅" && !user.bot && user.id === message.author.id);
    const joinMessageCollector = await joinMessage.createReactionCollector(filter);

    joinMessageCollector.on('collect', (reaction) => {
      if (reaction.emoji.name === "✅") {
        joinMessageCollector.stop();
      }
    });

    joinMessageCollector.on('end', async (collected) => {
      resolve(await updateAndAdd(collected, game._id));
    });
  })
}

export const attachMessageCollectorTags = async (tagsMessage, message, game, tags) => {
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

export const attachMessageCollectorRecap = async (recapMessage, message) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorSongPlaying", "Start");
  return new Promise(async (resolve, reject) => {
    const filter = (reaction, user) => (reaction.emoji.name === "✅" || reaction.emoji.name === "🚫") && !user.bot && user.id === message.author.id;
    const recapMessageCollector = recapMessage.createReactionCollector(filter, { max: 1, time: 30000 });

    recapMessageCollector.on('collect', async (reaction, user) => {
      if (reaction.emoji.name === "✅") {
        recapMessageCollector.stop();
      }
      // if (reaction.emoji.name === "🚫") {
      //   // recapMessageCollector.stop();
      //   return;
      // }
    });

    recapMessageCollector.on('end', (reaction, user) => {
      resolve(true)
    });
  })
}

export const attachMessageCollectorSongPlaying = async (songPlayingMessage, message, game, dispatcher, song) => {
  debuggerLog(new Date, "CC - collectors.attachMessageCollectorSongPlaying", "Start");
  return new Promise(async (resolve, reject) => {
    // const alreadyFindAnswer = (message, finders) => finders.find((u) => finders.includes(message.author.id));
    const filter = (m) => !m.author.bot; // Improve attachMessageCollectorSongPlaying players in game not other
    const songPlayingMessageCollector = songPlayingMessage.channel.createMessageCollector(filter, { time: game.trackTime });

    songPlayingMessageCollector.on('collect', async (message) => {
      if (song.correctWords.includes(message.content)) {
        message.delete()
        message.reply(`got it`);
        await addRank(game._id, 1, 1, game.players[0]._id, getPoints(1) + -(differenceInSeconds(new Date(), new Date()) - (game.trackTime / 1000)));
      }
    });

    songPlayingMessageCollector.on('end', async () => {
      dispatcher.end();
      resolve(true)
    });
  })
}