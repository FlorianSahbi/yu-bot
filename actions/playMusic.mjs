import ytdl from "ytdl-core-discord";
import sleep from "../utils/sleep.mjs";
import lookingForSound from "./lookingForSound.mjs";
import joinVoiceChannel from "./joinVoiceChannel.mjs";
import UPDATE_GAME_ADD_ROUND from "../graphql/updateGameAddRank.mjs";
import { request } from 'graphql-request';

const sendSongMessage = async (message, title, cover) => {
  const songMessage = await message.channel.send({
    embed: {
      description: `The song was : ${title}`,
      author: {
        name: 'Yu',
        icon_url: 'https://yu-client.vercel.app/yu.png',
        url: 'https://yu-client.vercel.app',
      },
      image: {
        url: cover,
      },
      color: "#ec4999",
    }
  })

  return songMessage;
}

const addRank = async (variables) => {
  return await request(process.env.YU_API, UPDATE_GAME_ADD_ROUND, variables);
}

const playMusic = async (message, song, game) => {
  console.log("DEBUG::playMusic");
  console.log({ input: game });

  const connection = await joinVoiceChannel(message);

  const dispatcher = await connection
    .play(await ytdl(song.url, { filter: _ => ["251"], highWaterMark: 1 << 25, quality: "highestaudio" }), { type: 'opus' })
    .on("finish", async () => {
      timer.delete();
      await sendSongMessage(message, song.title, song.cover);
      lookingForSound(message, game);
    })
    .on("error", error => console.error(error));

  dispatcher.setVolumeLogarithmic(5 / 5);
  const m = await message.channel.send({ embed: { title: `Track is playing 🎶` } });
  await sleep(2000)
  const timer = await message.channel.send("https://thumbs.gfycat.com/FlimsyTemptingBlackfish-size_restricted.gif");

  const filter = m => !m.author.bot;

  const collector = m.channel.createMessageCollector(filter, { time: game.trackTime });

  collector.on('collect', async m => {
    if (song.correctWords.includes(m.content)) {
      m.delete()
      m.reply(`got it`);
      const variables = { id: game._id, position: 1, player: game.players[0]._id, points: 30 };
      const { updateGameAddRank } = await addRank(variables);
      console.log(updateGameAddRank);
    }
  });

  collector.on('end', async () => {
    dispatcher.end();
  });
}

export default playMusic;
