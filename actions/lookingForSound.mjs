import GET_RANDOM_SONG from "../graphql/getRandomSong.mjs";
import UPDATE_GAME_ADD_ROUND from "../graphql/updateGameAddRound.mjs";
import GET_LEADERBOARD from "../graphql/getLeaderbord.mjs";
import playMusic from "./playMusic.mjs";
import { request } from 'graphql-request';
import endGame from "./endGame.mjs";

const getRandomSongFromDb = async (variables) => {
  return await request(process.env.YU_API, GET_RANDOM_SONG, variables);
}

const addRound = async (variables) => {
  return await request(process.env.YU_API, UPDATE_GAME_ADD_ROUND, variables);
}

const lookingForSound = async (message, game, round = 0, pos = 1) => {
  console.log("DEBUG::lookingForSound");
  let currentRound = round + 1
  let currentPos = pos;
  console.log(`DEBUG::Manche : ${currentRound}`);
  if (round > 1) {
    const varr = { gameId: game._id };
    const { getLeaderboard } = await request(process.env.YU_API, GET_LEADERBOARD, varr);
    console.log({puntooooo: getLeaderboard})
    if (getLeaderboard > 100) {
      endGame(message)
      return;
    }
  }
  // console.log({ input: game })
  const variables = { tag: game.tags[0]._id };
  // await message.channel.send("Looking for a song");
  const { randomSong } = await getRandomSongFromDb(variables);
  const variablesAddRound = { id: game._id, position: currentRound, song: randomSong._id };
  const { updateGameAddRound } = await addRound(variablesAddRound);
  // console.log({ output: updateGameAddRound })
  playMusic(message, randomSong, updateGameAddRound, currentRound, currentPos, [])
}

export default lookingForSound;
