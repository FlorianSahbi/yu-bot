import ytdl from "ytdl-core-discord";
import sleep from "../utils/sleep.mjs";
import lookingForSound from "./lookingForSound.mjs";
import joinVoiceChannel from "./joinVoiceChannel.mjs";
import UPDATE_GAME_ADD_ROUND from "../graphql/updateGameAddRank.mjs";
import { request } from 'graphql-request';
import { differenceInSeconds, format } from "date-fns";

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

const getPoints = (number) => {
  if (number === 1) {
    return 35;
  } else if (number === 2) {
    return 25;
  } else if (number === 3) {
    return 20;
  } else {
    return 10;
  }

}

const addRank = async (game, pos, round, tPoints) => {
  console.log({ rp: getPoints(pos), tp: tPoints })
  const variables = { id: game._id, round: round - 1, position: pos, player: game.players[0]._id, points: getPoints(pos) + tPoints };
  return await request(process.env.YU_API, UPDATE_GAME_ADD_ROUND, variables);
}

const alreadyFindAnswer = (message, finders) => finders.find((u) => finders.includes(message.author.id));


const playMusic = async (message, song, game, round, pos, finders) => {
  let newRoundTime = 0;
  console.log(`DEBUG::playMusic`);
  console.log(`DEBUG::${game._id}`)
  let currentF = finders;
  console.log({ input: game });

  const connection = await joinVoiceChannel(message);

  const dispatcher = await connection
    .play(await ytdl(song.url, { filter: _ => ["251"], highWaterMark: 1 << 25, quality: "highestaudio" }), { type: 'opus' })
    .on("finish", async () => {
      console.log("END", format(new Date, 'HH:mm:s'))
      await sendSongMessage(message, song.title, song.cover);
      lookingForSound(message, game, round);
    })
    .on("error", error => console.error(error));

  dispatcher.setVolumeLogarithmic(5 / 5);
  const m = await message.channel.send({ embed: { title: `Round : ${round} - Track is playing 🎶` } });
  newRoundTime = new Date();
  await sleep(2000)
  const timer = await message.channel.send("https://thumbs.gfycat.com/FlimsyTemptingBlackfish-size_restricted.gif").then(msg => {
    msg.delete({ timeout: 10000 /*time unitl delete in milliseconds*/ });
  })
    .catch(/*Your Error handling if the Message isn't returned, sent, etc.*/);;

  const filter = m => !m.author.bot;

  const collector = m.channel.createMessageCollector(filter, { time: game.trackTime });

  collector.on('collect', async (m) => {
    if (song.correctWords.includes(m.content) && !alreadyFindAnswer(message, finders)) {
      m.delete()
      m.reply(`got it`);
      const now = new Date();
      console.log("1", differenceInSeconds(now, newRoundTime))
      console.log("2", differenceInSeconds(now, newRoundTime) - (game.trackTime / 1000))
      console.log("3", -(differenceInSeconds(now, newRoundTime) - (game.trackTime / 1000)))
      const { updateGameAddRank } = await addRank(game, pos, round, -(differenceInSeconds(now, newRoundTime) - (game.trackTime / 1000)));
      pos = pos + 1;
      currentF.push(message.author.id)
    } else if (song.correctWords.includes(m.content) && alreadyFindAnswer(message, finders)) {
      m.delete();
      m.reply("you already got a point")
    }
  });

  collector.on('end', async () => {
    dispatcher.end();
  });
}

export default playMusic;
