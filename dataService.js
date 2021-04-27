const { request } = require('graphql-request');
const { debuggerLog } = require("./utils/debuggerLog");
const { TAGS } = require("./graphql/tags/tags");
const { GAME } = require("./graphql/games/game");
const { RANDOM_TRACK } = require("./graphql/games/randomTrack");
const { LEADERBOARD } = require("./graphql/games/leaderboard");
const { CREATE_GAME } = require("./graphql/games/createGame");
const { UPDATE_AND_ADD } = require("./graphql/games/updateAndAdd");
const { UPDATE_GAME_ADD_TAGS } = require("./graphql/games/updateGameAddTags");
const { UPDATE_GAME_ADD_ROUND } = require("./graphql/games/updateGameAddRound");
const { UPDATE_GAME_ADD_RANK } = require("./graphql/games/updateGameAddRank");

//////////////
// REQUESTS //
//////////////

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
    const variables = { id, roundInput: {position, track} };
    return request(process.env.YU_API, UPDATE_GAME_ADD_ROUND, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - addRound", error);
  }
}

exports.addRank = (id, round, position, user, points) => {
  debuggerLog(new Date, "DS - dataService.addRank", "Start");
  try {
    const variables = { id, round, rankInput: {position, user, points} };
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