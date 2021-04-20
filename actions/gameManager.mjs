import ytdl from "ytdl-core-discord";
import { request } from 'graphql-request';
import { differenceInSeconds, format } from "date-fns";

import debuggerLog from "../utils/debuggerLog.mjs";

import ADD_GAME from "../graphql/addGame.mjs";
import UPDATE_AND_ADD from "../graphql/updateAndAdd.mjs";
import GET_TAGS from "../graphql/tags.mjs";
import UPDATE_GAME_ADD_TAGS from "../graphql/updateGameAddTags.mjs";
import GET_GAME from "../graphql/getGame.mjs";
import GET_RANDOM_SONG from "../graphql/getRandomSong.mjs";
import UPDATE_GAME_ADD_ROUND from "../graphql/updateGameAddRound.mjs";
import UPDATE_GAME_ADD_RANK from "../graphql/updateGameAddRank.mjs";
import GET_LEADERBOARD from "../graphql/getLeaderbord.mjs";

const color = "#ec4999";
const author = {
  name: 'Yu',
  icon_url: 'https://yu-client.vercel.app/yu.png',
  url: 'https://yu-client.vercel.app',
};

//////////////
// REQUESTS //
//////////////
const createGame = () => {
  try {
    const variables = {};
    return request(process.env.YU_API, ADD_GAME, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - createGame", error);
  }
}

const updateAndAdd = (collected, id) => {
  try {
    const variables = { id, discordIds: collected.first().users.cache.filter(user => !user.bot).map(({ id }) => id) };
    return request(process.env.YU_API, UPDATE_AND_ADD, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - updateAndAdd", error);
  }
}

const getTags = () => {
  try {
    const variables = {};
    return request(process.env.YU_API, GET_TAGS, {});
  } catch (error) {
    debuggerLog(new Date, "Error - getTags", error);
  }
}

const updateGameWithTags = (id, tags) => {
  try {
    const variables = { id, tags };
    return request(process.env.YU_API, UPDATE_GAME_ADD_TAGS, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getTags", error);
  }
}

const getGame = (id) => {
  try {
    const variables = { id };
    return request(process.env.YU_API, GET_GAME, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getGame", error);
  }
}

const getRandomSongFromDb = (tag) => {
  try {
    const variables = { tag };
    return request(process.env.YU_API, GET_RANDOM_SONG, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getRandomSongFromDb", error);
  }
}

const addRound = (id, position, song) => {
  try {
    const variables = { id, position, song };
    return request(process.env.YU_API, UPDATE_GAME_ADD_ROUND, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - addRound", error);
  }
}

const addRank = (id, round, position, player, points) => {
  try {
    const variables = { id, round, position, player, points };
    return request(process.env.YU_API, UPDATE_GAME_ADD_RANK, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - addRound", error);
  }
}

//////////////
// MESSAGES //
//////////////
export const sendHelpMessage = async (message) => {
  const helpMessageEmbed = {
    embed: {
      color,
      author,
      description: "Below you can see all the commands I know",
      fields: [
        {
          name: "Blind test",
          value: "Simply use `!g (Temp.)`",
        },
      ],
    }
  };
  const helpMessage = await message.channel.send(helpMessageEmbed);
  return helpMessage;
}

const sendJoinMessage = async (message) => {
  const joinMessageEmbed = {
    embed: {
      color,
      author,
      description: "A new game is about to start",
      fields: [
        {
          name: "Join",
          value: "React with 👍",
        },
        {
          name: "Lock in",
          value: "React with ✅ (Game author only)",
        },
      ],
    }
  };
  const joinMessage = await message.channel.send(joinMessageEmbed);
  joinMessage.react("👍");
  joinMessage.react("✅");
  return joinMessage;
}

const sendTagsMessage = async (message, tags) => {
  const tagsMessageEmbed = {
    embed: {
      color,
      author,
      fields: [
        {
          name: "Tags",
          value: tags,
        },
      ],
    }
  }
  const tagsMessage = await message.channel.send(tagsMessageEmbed);
  return tagsMessage;
}

const sendValidationMessage = async (message, tag) => {
  const validationMessageEmbed = {
    embed: {
      color,
      author,
      description: `${message.author.username} has selected \`${tag.name}\``,
      image: {
        url: tag.cover,
      },
    }
  };
  const validationMessage = await message.channel.send(validationMessageEmbed);
  return validationMessage;
}

const sendRecapMessage = async (message, goal, time, tag, tagCover, players) => {
  const recapMessageEmbed = {
    embed: {
      author,
      color,
      description: "Game settings",
      fields: [
        {
          name: "Goal",
          value: goal,
        },
        {
          name: "Time to guess",
          value: `${time / 1000}s`,
        },
        {
          name: "Players",
          value: players
        },
        {
          name: "Theme",
          value: tag,
        },
        {
          name: "Ok with it ?",
          value: "React with ✅ (Game author only)",
        },
      ],
      image: {
        url: tagCover,
      }
    }
  };
  const recapMessage = await message.channel.send(recapMessageEmbed);
  recapMessage.react("✅");
  return recapMessage;
}

const sendSongPlayingMessage = async (message, round) => {
  const songPlayingMessageEmbed = {
    embed: {
      author,
      color,
      title: `Round : ${round} - Track is playing 🎶`,
      description: "https://thumbs.gfycat.com/FlimsyTemptingBlackfish-size_restricted.gif",
    }
  };
  const songPlayingMessage = await message.channel.send(songPlayingMessageEmbed);
  return songPlayingMessage;
}

const sendSongMessage = async (message, title, cover) => {
  const songMessageEmbed = {
    embed: {
      color,
      author,
      description: `The song was : ${title}`,
      // description: `The song was : ${title}`,
      // image: {
      //   url: cover,
      // },
    }
  };
  const songMessage = await message.channel.send(songMessageEmbed);
  return songMessage;
}

const sendEndGameMessage = async (message) => {
  const endGameMessageEmbed = {
    embed: {
      color,
      author,
      description: "END",
      fields: [
        {
          name: "Rank",
          value: "1st to last",
        },
        {
          name: "1/7 : Beelphiew#0000",
          value: "102pts",
        },
        {
          name: "2/7 : Dral#0000",
          value: "82pts",
        },
        {
          name: "3/7 : Flo#0000",
          value: "62pts",
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Thank you for using Yu 🌸',
      },
    }
  };
  const endGameMessage = await message.channel.send(endGameMessageEmbed);
  endGameMessage.react("👏");
  return endGameMessage;
}

////////////////
// COLLECTORS //
////////////////
const attachMessageCollectorJoin = async (joinMessage, message, game) => {
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

const attachMessageCollectorTags = async (tagsMessage, message, game, tags) => {
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

const attachMessageCollectorRecap = async (recapMessage, message) => {
  return new Promise(async (resolve, reject) => {
    const filter = (reaction, user) => reaction.emoji.name === "✅" && !user.bot && user.id === message.author.id;
    const recapMessageCollector = recapMessage.createReactionCollector(filter, { max: 1, time: 30000 });

    recapMessageCollector.on('collect', async (reaction, user) => {
      if (reaction.emoji.name === "✅") {
        recapMessageCollector.stop();
      }
    });

    recapMessageCollector.on('end', (reaction, user) => {
      resolve(true)
    });
  })
}

const attachMessageCollectorSongPlaying = async (songPlayingMessage, message, game, dispatcher, song) => {
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

//////////
// UTILS //
//////////
const joinVoiceChannel = async (message) => {
  if (!message.member.voice.channel) {
    message.channel.send("You need to be in a voice channel to play music!");
  }

  const permissions = message.member.voice.channel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    message.channel.send("I need the permissions to join and speak in your voice channel!");
  }

  try {
    return await message.member.voice.channel.join();
  } catch (error) {
    debuggerLog(new Date, "Error - joinVoiceChannel", error);
  }
}

const leaveVoiceChannel = async (message) => {
  try {
    message.member.voice.channel.leave();
    _connection = null;
  } catch (error) {
    debuggerLog(new Date, "Error - leaveVoiceChannel", error);
  }
}

const getPoints = (number) => {
  if (number === 1) {
    return 35;
  } else if (number === 2) {
    return 25;
  } else if (number === 3) {
    return 20;
  } else {
    return 10;
  }
}

//////////
// MAIN //
//////////
const gameManager = async (message) => {
  debuggerLog(new Date, "01 - gameManager.Init", "Start");

  // INIT
  debuggerLog(new Date, "02 - gameManager.createGame", "Start");
  const { addGame: gameData } = await createGame();
  debuggerLog(new Date, "03 - gameManager.createGame", "End");

  // PLAYERS JOIN MESSSAGE
  debuggerLog(new Date, "04 - gameManager.sendJoinMessage", "Start");
  const joinMessage = await sendJoinMessage(message);
  debuggerLog(new Date, "05 - gameManager.sendJoinMessage", "End");

  // PLAYERS JOIN
  debuggerLog(new Date, "06 - gameManager.attachMessageCollectorJoin", "Start");
  await attachMessageCollectorJoin(joinMessage, message, gameData);
  debuggerLog(new Date, "07 - gameManager.attachMessageCollectorJoin", "End");

  // TAGS MESSAGE
  debuggerLog(new Date, "08 - manage.sendTagsMessage", "Start");
  const { tags: { docs: tags } } = await getTags();
  const tagsMessage = await sendTagsMessage(message, tags.map((p) => `\`${p.name}\``).join(", "))
  debuggerLog(new Date, "09 - gameManager.sendTagsMessage", "End");

  //TAGS
  debuggerLog(new Date, "10 - gameManager.attachMessageCollectorTags", "Start");
  await attachMessageCollectorTags(tagsMessage, message, gameData, tags);
  debuggerLog(new Date, "11 - gameManager.attachMessageCollectorTags", "End");

  // RECAP MESSSAGE
  debuggerLog(new Date, "12 - gameManager.sendRecapMessage", "Start");
  const { game } = await getGame(gameData._id);
  const recapMessage = await sendRecapMessage(message, game.points, game.trackTime, game.tags.map((tag) => `\`${tag.name}\``).join(", "), game.tags.map((tag) => tag.cover)[0], game.players.map((user) => `\`${user.username}\``).join(", "));
  debuggerLog(new Date, "13 - gameManager.sendRecapMessage", "End");

  // RECAP
  debuggerLog(new Date, "14 - gameManager.attachMessageCollectorRecap", "Start");
  await attachMessageCollectorRecap(recapMessage, message);
  debuggerLog(new Date, "15 - gameManager.attachMessageCollectorRecap", "End");

  // START GAME 
  debuggerLog(new Date, "14 - gameManager.playMusic", "Start");
  const { randomSong: song } = await getRandomSongFromDb(game.tags[0]._id); // Improve
  await addRound(game._id, 0, song._id);
  const connection = await joinVoiceChannel(message)
  const dispatcher = await connection
    .play(await ytdl(song.url, { filter: _ => ["251"], highWaterMark: 50, quality: "highest" }), { type: 'opus' })
    .on("finish", async () => {
      await message.channel.send(`The song was : ${song.url}`);
      leaveVoiceChannel(message);
      // Nouvelle boucle
    })
    .on("error", error => {
      debuggerLog(new Date, "Error - playTrack", error);
    });
  debuggerLog(new Date, "15 - gameManager.playMusic", "End");

  // SONG PLAYING MESSAGE
  debuggerLog(new Date, "16 - gameManager.sendSongPlayingMessage", "Start");
  const songPlayingMessage = await sendSongPlayingMessage(message, 1);
  debuggerLog(new Date, "17 - gameManager.sendSongPlayingMessage", "End");

  // PLAYER RESPONSES
  debuggerLog(new Date, "18 - gameManager.playerResponses", "Start");
  await attachMessageCollectorSongPlaying(songPlayingMessage, message, game, dispatcher, song);
  debuggerLog(new Date, "19 - gameManager.playerResponses", "End");

  // END GAME MESSAGE
  debuggerLog(new Date, "20 - manage.sendEndGameMessage", "Start");
  await sendEndGameMessage(message);
  debuggerLog(new Date, "21 - gameManager.sendEndGameMessage", "End");
}

export default gameManager;
