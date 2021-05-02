const ytdl = require("ytdl-core-discord");
const { debuggerLog } = require("../utils/debuggerLog");
const { getPlaylistTracks, addRound, getLeaderbord, updateGuildIsPlaying } = require("../dataService");
const { sendSongPlayingMessage, sendSongMessage, sendEndGameMessage } = require("../messageService");
const { attachMessageCollectorSongPlaying, } = require("../collectors");

//////////
// MAIN //
//////////

const playTrack = async (message, game, connection, round, position, usersWithAnswer, score, queue) => {
  debuggerLog(new Date, "01 - PlaylistMod.playTrack", "Enter");
  const dispatcher = await connection
    .play(await ytdl(queue[0].videoUrl, { begin: "31s", highWaterMark: 2000, bitrate: 96, volume: false, quality: "highestaudio" }), { type: 'opus' })
    .on("start", async () => {
      debuggerLog(new Date, "01 - PlaylistMod.playTrack", "Start");
      const songPlayingMessage = await sendSongPlayingMessage(message, round, score);
      await attachMessageCollectorSongPlaying(round, songPlayingMessage, message, game, dispatcher, queue[0], new Date(), position, usersWithAnswer)
    })
    .on("finish", async () => {
      debuggerLog(new Date, "01 - PlaylistMod.playTrack", "Finish");
      await sendSongMessage(message, queue[0].title, queue[0].thumbnail, queue[0].videoUrl);
      playlistMod(message, game, connection, round + 1, 1, usersWithAnswer = [], queue);
    })
    .on("error", error => {
      debuggerLog(new Date, "MS - PlaylistMod.playTrack", error);
    });
}

const playlistMod = async (message, game, connection, round = 1, position = 1, usersWithAnswer = [], queue = []) => {
  queue.shift()
  debuggerLog(new Date, "01 - PlaylistMod.Init", "0");
  const { leaderboard: score } = await getLeaderbord(game._id);
  debuggerLog(new Date, "01 - PlaylistMod.someoneHasWin", "someoneHasWin Yes");
  if (queue.length <= 0 && round === 1) {
    const { playlistTracks: tracks } = await getPlaylistTracks(game.tags[0]._id); // Improve
    queue = tracks;
    await addRound(game._id, round, queue[0]._id);
    playTrack(message, game, connection, round, position, usersWithAnswer, score, queue);
  } else if (queue.length > 0 && round >= 1) {
    await addRound(game._id, round, queue[0]._id);
    playTrack(message, game, connection, round, position, usersWithAnswer, score, queue);
  } else {
    const { leaderboard } = await getLeaderbord(game._id);
    await updateGuildIsPlaying(message.guild.id, false);
    await sendEndGameMessage(message, leaderboard);
  }
  debuggerLog(new Date, "01 - PlaylistMod.Init", "1");
}

exports.playlistMod = playlistMod;