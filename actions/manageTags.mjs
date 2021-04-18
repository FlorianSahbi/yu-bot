import GET_TAGS from "../graphql/tags.mjs";
import UPDATE_GAME_ADD_TAGS from "../graphql/updateGameAddTags.mjs";
import showSettings from "./showSettings.mjs";
import { request } from 'graphql-request';

const updateGameWithTags = async (variables) => {
  return await request(process.env.YU_API, UPDATE_GAME_ADD_TAGS, variables);
}

const sendValidationMessage = async (message, tag) => {
  await message.channel.send({
    embed: {
      color: "#ec4999",
      author: {
        name: 'Yu',
        icon_url: 'https://yu-client.vercel.app/yu.png',
        url: 'https://yu-client.vercel.app',
      },
      description: `${message.author.username} selected \`${message.content}\``,
      image: {
        url: tag.cover,
      },
    }
  })
}

const sendTagsMessage = async (channel, tags) => {
  const tagsMessage = await channel.send({
    embed: {
      color: "#ec4999",
      fields: [
        {
          name: "Tags",
          value: tags,
        },
      ],
    }
  })
  return tagsMessage;
}

const generateListOfTags = async (tags) => {
  return await tags.map((p) => `\`${p.name}\``).join(", ");
}

const getTags = async () => {
  const { tags: { docs } } = await request(process.env.YU_API, GET_TAGS);
  return docs;
}

// Affiche le message qui permet à l'utilisateur de selectionner un tag dans une list recupérée sur le db
const manageTags = async (message, game) => {
  console.log("DEBUG::manageTags")
  console.log({ input: game })

  const tags = await getTags();
  const tagsMessage = await sendTagsMessage(message.channel, await generateListOfTags(tags))

  const filter = m => !m.author.bot && m.author.id === message.author.id;
  const collector = tagsMessage.channel.createMessageCollector(filter, { time: 30000 });

  collector.on('collect', async (message) => {
    if (tags.map(({ name }) => name).includes(message.content)) {
      const selectedTag = await tags.find(({ name }) => name === message.content);
      message.delete();
      await sendValidationMessage(message, selectedTag);
      const variables = { id: game._id, tags: selectedTag._id };
      const { updateGameAddTags } = await updateGameWithTags(variables)
      await collector.stop();
      console.log({ output: updateGameAddTags })
      showSettings(message, updateGameAddTags)
    } else {
      message.reply(`${message.content} does not exists`);
    }
  });

  collector.on('end', async collected => {
    if (collected.length <= 0) {
      message.channel.send("30sec inactivity")
    }
  });
}

export default manageTags;
