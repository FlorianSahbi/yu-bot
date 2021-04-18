import GET_RANDOM_SONG from "../graphql/getRandomSong.mjs";
import UPDATE_GAME_ADD_ROUND from "../graphql/updateGameAddRound.mjs";
import playMusic from "./playMusic.mjs";
import { request } from 'graphql-request';

const getRandomSongFromDb = async (variables) => {
  return await request(process.env.YU_API, GET_RANDOM_SONG, variables);
}

const addRound = async (variables) => {
  return await request(process.env.YU_API, UPDATE_GAME_ADD_ROUND, variables);
}

const lookingForSound = async (message, game) => {
  console.log("DEBUG::lookingForSound");
  console.log({ input: game })
  const variables = { tag: game.tags[0]._id };
  // await message.channel.send("Looking for a song");
  const { randomSong } = await getRandomSongFromDb(variables);
  const variablesAddRound = { id: game._id, position: 1, song: randomSong._id };
  console.log(variablesAddRound)
  const { updateGameAddRound } = await addRound(variablesAddRound);
  console.log(updateGameAddRound)
  console.log({ output: updateGameAddRound })
  playMusic(message, randomSong, updateGameAddRound)
}

export default lookingForSound;
