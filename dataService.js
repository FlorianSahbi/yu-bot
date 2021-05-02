const { request } = require('graphql-request');
const { debuggerLog } = require("./utils/debuggerLog");
const { TAGS } = require("./graphql/tags/tags");
const { GAME } = require("./graphql/games/game");
const { DELETE_GAME } = require("./graphql/games/deleteGame");
const { RANDOM_TRACK } = require("./graphql/games/randomTrack");
const { LEADERBOARD } = require("./graphql/games/leaderboard");
const { CREATE_GUILD } = require("./graphql/guilds/createGuild");
const { GUILD_BY_GUILD_ID } = require("./graphql/guilds/guildByGuildId");
const { CREATE_GAME } = require("./graphql/games/createGame");
const { UPDATE_AND_ADD } = require("./graphql/games/updateAndAdd");
const { UPDATE_GAME_ADD_TAGS } = require("./graphql/games/updateGameAddTags");
const { UPDATE_GAME_ADD_ROUND } = require("./graphql/games/updateGameAddRound");
const { UPDATE_GAME_ADD_RANK } = require("./graphql/games/updateGameAddRank");
const { PLAYLIST_TRACKS } = require("./graphql/games/playlistTracks");
const { UPDATE_GUILD_IS_PLAYING } = require("./graphql/guilds/updateGuildIsPlaying");
const { UPDATE_USER_ADD_GAME } = require("./graphql/users/updateUserAddGame");
const { UPDATE_USER_ADD_TRACK } = require("./graphql/users/updateUserAddTrack");
const { UPDATE_USER_ADD_TAG } = require("./graphql/users/updateUserAddTag");
const { UPDATE_USER_ADD_GUILD } = require("./graphql/users/updateUserAddGuild");

//////////////
// REQUESTS //
//////////////

exports.createGuild = async ({
  id,
  name,
  icon,
  region,
  memberCount,
  premiumTier,
  premiumSubscriptionCount,
  joinedTimestamp,
  maximumMembers,
  preferredLocale,
  ownerID }) => {
  debuggerLog(new Date, "DS - dataService.createGuild", "Start");
  const values = { id, name, icon, region, memberCount, premiumTier, premiumSubscriptionCount, joinedTimestamp, maximumMembers, preferredLocale, ownerID };
  try {
    const variables = { guildInput: { ...values } }
    const { createGame } = await request(process.env.YU_API, CREATE_GUILD, variables);
    return createGame;
  } catch (error) {
    debuggerLog(new Date, "Error - createGuild", error);
  }
}

exports.createGame = async () => {
  debuggerLog(new Date, "DS - dataService.createGame", "Start");
  try {
    const variables = {};
    const { createGame } = await request(process.env.YU_API, CREATE_GAME, variables);
    return createGame;
  } catch (error) {
    debuggerLog(new Date, "Error - createGame", error);
  }
}

exports.updateAndAdd = (collected, id) => {
  debuggerLog(new Date, "DS - dataService.updateAndAdd", "Start");
  try {
    const variables = { id, userDiscordData: collected.first().users.cache.filter(user => !user.bot).map((user) => ({ id: user.id, username: user.username, avatar: user.avatarURL() })) };
    return request(process.env.YU_API, UPDATE_AND_ADD, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - updateAndAdd", error);
  }
}

exports.getTags = () => {
  debuggerLog(new Date, "DS - dataService.getTags", "Start");
  try {
    const variables = {};
    return request(process.env.YU_API, TAGS, {});
  } catch (error) {
    debuggerLog(new Date, "Error - getTags", error);
  }
}

exports.updateGameWithTags = (id, tags) => {
  debuggerLog(new Date, "DS - dataService.updateGameWithTags", "Start");
  try {
    const variables = { id, tags };
    return request(process.env.YU_API, UPDATE_GAME_ADD_TAGS, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getTags", error);
  }
}

exports.getGame = async (id) => {
  debuggerLog(new Date, "DS - dataService.getGame", "Start");
  try {
    const variables = { id };
    const { game } = await request(process.env.YU_API, GAME, variables);
    return game;
  } catch (error) {
    debuggerLog(new Date, "Error - getGame", error);
  }
}

exports.addRound = (id, position, track) => {
  debuggerLog(new Date, "DS - dataService.addRound", "Start");
  try {
    const variables = { id, roundInput: { position, track } };
    return request(process.env.YU_API, UPDATE_GAME_ADD_ROUND, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - addRound", error);
  }
}

exports.addRank = (id, round, position, user, points) => {
  debuggerLog(new Date, "DS - dataService.addRank", "Start");
  try {
    const variables = { id, round, rankInput: { position, user, points } };
    return request(process.env.YU_API, UPDATE_GAME_ADD_RANK, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - addRound", error);
  }
}

exports.getLeaderbord = (id) => {
  debuggerLog(new Date, "DS - dataService.getLeaderbord", "Start");
  try {
    const variables = { id };
    return request(process.env.YU_API, LEADERBOARD, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getLeaderbord", error);
  }
}

exports.getRandomSongFromDb = (tag) => {
  debuggerLog(new Date, "DS - dataService.getRandomSongFromDb", "Start");
  try {
    const variables = { tag };
    return request(process.env.YU_API, RANDOM_TRACK, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getRandomSongFromDb", error);
  }
}

exports.getPlaylistTracks = (tag) => {
  debuggerLog(new Date, "DS - dataService.getPlaylistTracks", "Start");
  try {
    const variables = { tag };
    return request(process.env.YU_API, PLAYLIST_TRACKS, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getPlaylistTracks", error);
  }
}

exports.deleteGame = (id) => {
  debuggerLog(new Date, "DS - dataService.deleteGame", "Start");
  try {
    const variables = { id };
    return request(process.env.YU_API, DELETE_GAME, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - deleteGame", error);
  }
}

exports.getGuildByGuildId = (id) => {
  debuggerLog(new Date, "DS - dataService.getGuildByGuildId", "Start");
  try {
    const variables = { id };
    return request(process.env.YU_API, GUILD_BY_GUILD_ID, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getGuildByGuildId", error);
  }
}

exports.updateGuildIsPlaying = (id, isPlaying) => {
  debuggerLog(new Date, "DS - dataService.getGuildByGuildId", "Start");
  try {
    const variables = { id, isPlaying };
    return request(process.env.YU_API, UPDATE_GUILD_IS_PLAYING, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getGuildByGuildId", error);
  }
}

///////////////////
// REQUESTS USER //
///////////////////

exports.updateUserAddGame = (id, gameId) => {
  debuggerLog(new Date, "DS - dataService.updateUserAddGame", "Start");
  try {
    const variables = { id, gameId };
    return request(process.env.YU_API, UPDATE_USER_ADD_GAME, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - updateUserAddGame", error);
  }
}

exports.updateUserAddTrack = (id, trackId) => {
  debuggerLog(new Date, "DS - dataService.updateUserAddTrack", "Start");
  try {
    const variables = { id, trackId };
    return request(process.env.YU_API, UPDATE_USER_ADD_TRACK, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - updateUserAddTrack", error);
  }
}

exports.updateUserAddTag = (id, tagId) => {
  debuggerLog(new Date, "DS - dataService.updateUserAddTag", "Start");
  try {
    const variables = { id, tagId };
    return request(process.env.YU_API, UPDATE_USER_ADD_TAG, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - updateUserAddTag", error);
  }
}

exports.updateUserAddGuild = (id, guildId) => {
  debuggerLog(new Date, "DS - dataService.updateUserAddGuild", "Start");
  try {
    const variables = { id, guildId };
    return request(process.env.YU_API, UPDATE_USER_ADD_GUILD, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - updateUserAddGuild", error);
  }
}
