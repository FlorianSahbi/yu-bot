import ytdl from "ytdl-core-discord";
import debuggerLog from "../utils/debuggerLog.mjs";

import {
  getRandomSongFromDb,
  addRound,
  getLeaderbord,
} from "../dataService.mjs";

import {
  sendSongPlayingMessage,
  sendSongMessage,
  sendEndGameMessage,
} from "../messageService.mjs";

import {
  attachMessageCollectorSongPlaying,
} from "../collectors.mjs";

function getMax(score) {
  return score.reduce((acc, rank) => rank.points > acc ? rank.points : acc, 0);
}

function someoneHasWin(game, score) {
  debuggerLog(new Date, "01 - stateManager.someoneHasWin", "0");
  return new Promise(async (resolve, reject) => {
    if (score.length <= 0) {
      resolve(false);
    }
    if (score.length > 0) {
      if (getMax(score) > game.points) {
        resolve(true);
      } else {
        resolve(false);
      }
    }
  })
}

//////////
// MAIN //
//////////

const playTrack = async (message, game, connection, song, round, position, usersWithAnswer, score) => {
  debuggerLog(new Date, "01 - stateManager.playTrack", "Enter");
  const dispatcher = await connection
    .play(await ytdl(song.url, { highWaterMark: 2000, bitrate: 96, volume: false, quality: "highestaudio" }), { type: 'opus' })
    .on("start", async () => {
      debuggerLog(new Date, "01 - stateManager.playTrack", "Start");
      const songPlayingMessage = await sendSongPlayingMessage(message, round, score);
      await attachMessageCollectorSongPlaying(round, songPlayingMessage, message, game, dispatcher, song, new Date(), position, usersWithAnswer)
    })
    .on("finish", async () => {
      debuggerLog(new Date, "01 - stateManager.playTrack", "Finish");
      await sendSongMessage(message, song.title, song.cover, song.url);
      stateManager(message, game, connection, round + 1, 1, usersWithAnswer = []);
    })
    .on("error", error => {
      debuggerLog(new Date, "MS - stateManager.playTrack", error);
    });
}

const stateManager = async (message, game, connection, round = 1, position = 1, usersWithAnswer = []) => {
  debuggerLog(new Date, "01 - stateManager.Init", "0");
  const { getLeaderboard: score } = await getLeaderbord(game._id);
  if (await someoneHasWin(game, score) === false) {
    const { randomSong: song } = await getRandomSongFromDb(game.tags[0]._id); // Improve
    await addRound(game._id, round, song._id);
    playTrack(message, game, connection, song, round, position, usersWithAnswer, score);
  } else {
    const { getLeaderboard } = await getLeaderbord(game._id);
    await sendEndGameMessage(message, getLeaderboard);
  }
  debuggerLog(new Date, "01 - stateManager.Init", "1");
}

export default stateManager;
