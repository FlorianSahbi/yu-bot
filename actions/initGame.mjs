import { request } from 'graphql-request';
import ADD_GAME from "../graphql/addGame.mjs";
import askJoin from "./askJoin.mjs";

const createGame = async () => {
  try {
    return await request(process.env.YU_API, ADD_GAME, {});
  } catch (error) {
    console.error(error);
  }
}

const initGame = async (message) => {
  console.log("DEBUG::initGame")
  // console.log({ input: null })
  const { addGame } = await createGame();
  // console.log({ output: addGame })
  askJoin(message, addGame);
}

export default initGame;
