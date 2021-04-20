import ytdl from "ytdl-core-discord";
import debuggerLog from "../utils/debuggerLog.mjs";

import {
  createGame,
  updateAndAdd,
  getTags,
  updateGameWithTags,
  getGame,
  getRandomSongFromDb,
  addRound,
  addRank
} from "../dataService.mjs";

import {
  sendHelpMessage,
  sendJoinMessage,
  sendTagsMessage,
  sendValidationMessage,
  sendRecapMessage,
  sendSongPlayingMessage,
  sendSongMessage,
  sendEndGameMessage,
} from "../messageService.mjs";

import {
  attachMessageCollectorJoin,
  attachMessageCollectorTags,
  attachMessageCollectorRecap,
  attachMessageCollectorSongPlaying,
} from "../collectors.mjs";

import {
  joinVoiceChannel,
  leaveVoiceChannel,
  getPoints,
} from "../utils.mjs";

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
  debuggerLog(new Date, "08 - gameManager.sendTagsMessage", "Start");
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
