import GET_USERS from "../graphql/users.mjs";
import UPDATE_GAME from "../graphql/updateGame.mjs";
import manageTags from "./manageTags.mjs";
import { request } from 'graphql-request';

// DATA HERE
// {
// _id: '607b882adc075cfc2f1d71dc',
// name: "Yu's game",
// points: 100,
// trackTime: 10000,
// players: [],
// tags: [],
// history: []
// }
// Affiche le message qui permet à Yu d'annoncer aux utilisateurs qu'une partie est en train de se lancer

const updateGameWithPlayers = async (variables) => {
  return await request(process.env.YU_API, UPDATE_GAME, variables);
}

const getUsersByDiscordId = async (users, discordIds) => {
  return await users.users.filter((user) => discordIds.includes(user.discordId)).map((user) => user._id);
}

const getUsers = async () => {
  return await request(process.env.YU_API, GET_USERS);
}

const getPlayersDiscordId = async (collected) => {
  return await collected.first().users.cache.filter(user => !user.bot).map(({ id }) => id)
}

const sendMessage = async (message) => {
  const joinMessage = await message.channel.send({
    embed: {
      color: "#ec4999",
      author: {
        name: 'Yu',
        icon_url: 'https://yu-client.vercel.app/yu.png',
        url: 'https://yu-client.vercel.app',
      },
      description: "A new game is about to start",
      fields: [
        {
          name: "Join",
          value: "React with 👍",
        },
        {
          name: "Lock in",
          value: "React with ✅ (Game author only)",
        },
      ],
    }
  });

  return joinMessage;
}

const askJoin = async (message, game) => {
  console.log("DEBUG::askJoin")

  const joinMessage = await sendMessage(message);
  await joinMessage.react("👍");
  await joinMessage.react("✅");

  const filter = (reaction, user) => (reaction.emoji.name === "👍" && !user.bot) || (reaction.emoji.name === "✅" && !user.bot && user.id === message.author.id);
  const collector = await joinMessage.createReactionCollector(filter);

  collector.on('collect', (reaction) => {
    if (reaction.emoji.name === "✅") {
      collector.stop();
    }
  });

  collector.on('end', async (collected) => {
    const players = await getUsersByDiscordId(await getUsers(), await getPlayersDiscordId(collected));
    if (players.length <= 0) {
      message.channel.send("No enough players, END");
    } else {
      const variables = { id: game._id, tags: [], players };
      const { updateGame } = await updateGameWithPlayers(variables);
      manageTags(message, updateGame);
    }
  });
}

export default askJoin;
