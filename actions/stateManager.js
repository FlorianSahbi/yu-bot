const ytdl = require("ytdl-core-discord");
const { debuggerLog } = require("../utils/debuggerLog");
const { getRandomSongFromDb, addRound, getLeaderbord, } = require("../dataService");
const { sendSongPlayingMessage, sendSongMessage, sendEndGameMessage, } = require("../messageService");
const { attachMessageCollectorSongPlaying, } = require("../collectors");

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
      console.log(getMax(score))
      console.log(game.goal)
      console.log(score)
      if (getMax(score) > game.goal) {
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
    .play(await ytdl(song.videoUrl, { highWaterMark: 2000, bitrate: 96, volume: false, quality: "highestaudio" }), { type: 'opus' })
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
  const { leaderboard: score } = await getLeaderbord(game._id);
  if (await someoneHasWin(game, score) === false) {
    debuggerLog(new Date, "01 - stateManager.someoneHasWin", "someoneHasWin Yes");
    const { randomTrack: song } = await getRandomSongFromDb(game.tags[0]._id); // Improve
    await addRound(game._id, round, song._id);
    playTrack(message, game, connection, song, round, position, usersWithAnswer, score);
  } else {
    debuggerLog(new Date, "01 - stateManager.someoneHasWin", "someoneHasWin False");
    const { leaderboard } = await getLeaderbord(game._id);
    await sendEndGameMessage(message, leaderboard);
  }
  debuggerLog(new Date, "01 - stateManager.Init", "1");
}

exports.stateManager = stateManager;
