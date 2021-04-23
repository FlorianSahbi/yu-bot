import debuggerLog from "../utils/debuggerLog.mjs";
import stateManager from "./stateManager.mjs";
import {
  createGame,
  getTags,
  getGame,
} from "../dataService.mjs";

import {
  sendJoinMessage,
  sendTagsMessage,
  sendRecapMessage,
} from "../messageService.mjs";

import {
  attachMessageCollectorJoin,
  attachMessageCollectorTags,
  attachMessageCollectorRecap,
} from "../collectors.mjs";

import {
  joinVoiceChannel,
} from "../utils.mjs";

//////////
// MAIN //
//////////

const gameManager = async (message, nextStep = true, game = null) => {
  debuggerLog(new Date, "01 - gameManager", "0");

  if (nextStep) {
    debuggerLog(new Date, "02 - gameManager.createGame", "0 - Add game to db");
    game = await createGame();
    debuggerLog(new Date, "03 - gameManager.createGame", "1 - Game has been created");
  }

  if (nextStep) {
    debuggerLog(new Date, "04 - gameManager.joinMessageAndAction", "0 - Message will be send");
    const joinMessage = await sendJoinMessage(message);
    nextStep = await attachMessageCollectorJoin(joinMessage, message, game);
    debuggerLog(new Date, "05 - gameManager.joinMessageAndAction", "1 - Message sent and users responses collected");
  }

  if (nextStep) {
    debuggerLog(new Date, "06 - gameManager.tagsMessageAndAction", "0 - Message will be send");
    const { tags: { docs: tags } } = await getTags();
    const tagsMessage = await sendTagsMessage(message, tags.map((p) => `\`${p.name}\``).join(", "))
    await attachMessageCollectorTags(tagsMessage, message, game, tags);
    debuggerLog(new Date, "07 - gameManager.tagsMessageAndAction", "1 - Message sent and users responses collected");
  }

  if (nextStep) {
    debuggerLog(new Date, "08 - gameManager.recapMessageAndAction", "0 - Message will be send");
    game = await getGame(game._id);
    const recapMessage = await sendRecapMessage(message, game.points, game.trackTime, game.tags.map((tag) => `\`${tag.name}\``).join(", "), game.tags.map((tag) => tag.cover)[0], game.players.map((user) => `\`${user.username}\``).join(", "));
    nextStep = await attachMessageCollectorRecap(recapMessage, message);
    debuggerLog(new Date, "09 - gameManager.recapMessageAndAction", "1 - Message sent and got response from author");
  }

  if (nextStep) {
    debuggerLog(new Date, "10 - gameManager.startGame", "0 - Bot will join and game will be launch");
    const connection = await joinVoiceChannel(message)
    stateManager(message, game, connection);
  }

  debuggerLog(new Date, "01 - gameManager", "1");
}

export default gameManager;
