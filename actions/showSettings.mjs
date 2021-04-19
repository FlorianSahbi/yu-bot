import GET_GAME from "../graphql/getGame.mjs";
import lookingForSound from "./lookingForSound.mjs";
import { request } from 'graphql-request';

// gameData: {
//   _id: '607b93d2dc075cfc2f1d7206',
//   name: "Yu's game",
//   points: 100,
//   trackTime: 10000,
//   players: [ [Object] ],
//   tags: [ [Object] ],
//   history: [ [Object], [Object] ]
// }

const getGame = async (variables) => {
  const { game } = await request(process.env.YU_API, GET_GAME, variables);
  return game;
}

const sendRecapMessage = async (message, goal, time, tag, players) => {
  const recapMessage = await message.channel.send({
    embed: {
      description: "Game settings",
      author: {
        name: 'Yu',
        icon_url: 'https://yu-client.vercel.app/yu.png',
        url: 'https://yu-client.vercel.app',
      },
      color: "#ec4999",
      fields: [
        {
          name: "Goal",
          value: goal,
        },
        {
          name: "Time to guess",
          value: `${time / 1000}s`,
        },
        {
          name: "Theme",
          value: tag,
        },
        {
          name: "Players",
          value: players
        },
        {
          name: "Ok with it ?",
          value: "React with ✅ (Game author only)",
        },
      ],
    }
  })

  return recapMessage;
}

const showSettings = async (message, game) => {
  console.log("DEBUG::showSettings");
  // console.log({ input: game })
  
  const variables = { id: game._id };
  const gameData = await getGame(variables);

  const recapMessage = await sendRecapMessage(message, gameData.points, gameData.trackTime, gameData.tags.map((tag) => `\`${tag.name}\``).join(", "), gameData.players.map((user) => `\`${user.username}\``).join(", "));
  recapMessage.react("✅");

  const filter = (reaction, user) => reaction.emoji.name === "✅" && !user.bot;
  const collector = recapMessage.createReactionCollector(filter, { max: 1, time: 30000 });

  collector.on('collect', (reaction, user) => {
    console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
    lookingForSound(message, gameData);
  });
}

export default showSettings;
