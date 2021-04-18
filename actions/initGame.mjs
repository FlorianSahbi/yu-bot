import { request } from 'graphql-request';
import ADD_GAME from "../graphql/addGame.mjs";
import askJoin from "./askJoin.mjs";

const createGame = async (variables) => {
  try {
    return await request(process.env.YU_API, ADD_GAME, variables);
  } catch (error) {
    console.error(error);
  }
}

const initGame = async (message) => {
  console.log("DEBUG::initGame")
  const variables = { players: [], tags: [], history: [] }
  const { addGame } = await createGame(variables);
  askJoin(message, addGame);
}

export default initGame;
