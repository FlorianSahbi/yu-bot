import { request } from 'graphql-request';
import debuggerLog from "./utils/debuggerLog.mjs";
import ADD_GAME from "./graphql/addGame.mjs";
import UPDATE_AND_ADD from "./graphql/updateAndAdd.mjs";
import GET_TAGS from "./graphql/tags.mjs";
import UPDATE_GAME_ADD_TAGS from "./graphql/updateGameAddTags.mjs";
import GET_GAME from "./graphql/getGame.mjs";
import GET_RANDOM_SONG from "./graphql/getRandomSong.mjs";
import UPDATE_GAME_ADD_ROUND from "./graphql/updateGameAddRound.mjs";
import UPDATE_GAME_ADD_RANK from "./graphql/updateGameAddRank.mjs";
import GET_LEADERBOARD from "./graphql/getLeaderbord.mjs";

//////////////
// REQUESTS //
//////////////

export const createGame = () => {
  debuggerLog(new Date, "DS - dataService.createGame", "Start");
  try {
    const variables = {};
    return request(process.env.YU_API, ADD_GAME, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - createGame", error);
  }
}

export const updateAndAdd = (collected, id) => {
  debuggerLog(new Date, "DS - dataService.updateAndAdd", "Start");
  try {
    const variables = { id, discordIds: collected.first().users.cache.filter(user => !user.bot).map(({ id }) => id) };
    return request(process.env.YU_API, UPDATE_AND_ADD, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - updateAndAdd", error);
  }
}

export const getTags = () => {
  debuggerLog(new Date, "DS - dataService.getTags", "Start");
  try {
    const variables = {};
    return request(process.env.YU_API, GET_TAGS, {});
  } catch (error) {
    debuggerLog(new Date, "Error - getTags", error);
  }
}

export const updateGameWithTags = (id, tags) => {
  debuggerLog(new Date, "DS - dataService.updateGameWithTags", "Start");
  try {
    const variables = { id, tags };
    return request(process.env.YU_API, UPDATE_GAME_ADD_TAGS, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getTags", error);
  }
}

export const getGame = (id) => {
  debuggerLog(new Date, "DS - dataService.getGame", "Start");
  try {
    const variables = { id };
    return request(process.env.YU_API, GET_GAME, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getGame", error);
  }
}

export const getRandomSongFromDb = (tag) => {
  debuggerLog(new Date, "DS - dataService.getRandomSongFromDb", "Start");
  try {
    const variables = { tag };
    return request(process.env.YU_API, GET_RANDOM_SONG, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - getRandomSongFromDb", error);
  }
}

export const addRound = (id, position, song) => {
  debuggerLog(new Date, "DS - dataService.addRound", "Start");
  try {
    const variables = { id, position, song };
    return request(process.env.YU_API, UPDATE_GAME_ADD_ROUND, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - addRound", error);
  }
}

export const addRank = (id, round, position, player, points) => {
  debuggerLog(new Date, "DS - dataService.addRank", "Start");
  try {
    const variables = { id, round, position, player, points };
    return request(process.env.YU_API, UPDATE_GAME_ADD_RANK, variables);
  } catch (error) {
    debuggerLog(new Date, "Error - addRound", error);
  }
}
