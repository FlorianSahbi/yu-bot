import ytdl from "ytdl-core-discord";
import sleep from "../utils/sleep.mjs";
import lookingForSound from "./lookingForSound.mjs";
import joinVoiceChannel from "./joinVoiceChannel.mjs";

const playMusic = async (message, song, game) => {
  console.log("DEBUG::playMusic");

  const connection = await joinVoiceChannel(message);

  const dispatcher = await connection
    .play(await ytdl(song.url, { filter: _ => ["251"], highWaterMark: 1 << 25, quality: "highestaudio" }), { type: 'opus' })
    .on("finish", () => {
      timer.delete();
      lookingForSound(message, game);
    })
    .on("error", error => console.error(error));

  dispatcher.setVolumeLogarithmic(5 / 5);
  const m = await message.channel.send(`Track is playing 🎶`);
  await sleep(2000)
  const timer = await message.channel.send("https://thumbs.gfycat.com/FlimsyTemptingBlackfish-size_restricted.gif");

  const filter = m => !m.author.bot;

  const collector = m.channel.createMessageCollector(filter, { time: 10000 });

  collector.on('collect', async m => {
    if (song.randomSong.correctWords.includes(m.content)) {
      m.delete()
      m.reply(`got it`);
    }
  });

  collector.on('end', async () => {
    dispatcher.end();
  });
}

export default playMusic;
