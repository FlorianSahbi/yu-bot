import { Client } from "discord.js";
import initGame from "./actions/initGame.mjs";
import ytdl from "ytdl-core-discord";
import { format } from "date-fns";

const client = new Client();
const config = { prefix: "!" };

client.once("ready", () => {
  console.log(`${format(new Date(), 'HH:mm:s')} : Ready`)
});

client.once("reconnecting", () => {
});

client.once("disconnect", () => {
});

client.on("message", async message => {
  if (message.author.bot) {
    return;
  }
  if (!message.content.startsWith(config.prefix)) {
    return;
  }
  else if (message.content.startsWith(`${config.prefix}g`)) {
    initGame(message)
    return;
  }
  else if (message.content.startsWith(`${config.prefix}test`)) {
    if (!message.member.voice.channel) {
      message.channel.send("You need to be in a voice channel to play music!");
    }
    const permissions = message.member.voice.channel.permissionsFor(message.client.user);
    if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
      message.channel.send("I need the permissions to join and speak in your voice channel!");
    }
    const videoID = "https://www.youtube.com/watch?v=rTJjtSP-ORc"
    // const videoID = "https://www.youtube.com/watch?v=Ox2ySH4EAc8"
    const connection = await message.member.voice.channel.join();
    let info = await ytdl.getInfo(videoID);
    let audioFormats = await ytdl.filterFormats(info.formats, 'audioonly');
    let format = ytdl.chooseFormat(info.formats, { quality: '251' });
    // await connection.play(await ytdl(videoID, {quality:"highest",filter:"audioandvideo"}), { type: 'opus' })
    await connection.play(await ytdl(videoID, {highWaterMark: 50, quality:"highest",filter:"audioonly"}), { type: 'opus' })
    console.log('Format found!', format);

    // const dispatcher = await connection
    //   .play(await ytdl(videoID, { highWaterMark: 50 }), { type: 'opus' })
    //   .on("finish", async () => {})
    //   .on("info", async (info) => console.log(info))
    //   .on("error", error => console.error(error));
    return;
  }

  else {
    message.channel.send("You need to enter a valid command!");
  }
});

client.login(process.env.YU_TOKEN || config.token);
