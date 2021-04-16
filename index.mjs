import { Client } from "discord.js";
import config from "./config.json";
import ytdl from "ytdl-core-discord";
import { request } from 'graphql-request';
import GET_SONGS from "./graphql/songs.mjs";
import GET_TAGS from "./graphql/tags.mjs";
import getIndex from "./tools/getIndex.mjs";
import getUnicode from "./tools/getUnicode.mjs";

global._prodEnv = "https://yu-server.herokuapp.com/";
global._devEnv = "http://localhost:4000/";
global._activePlaylist = null;
global._aReact = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "➡️",
  "⬅️",
]

const joinVoiceChannel = async (message) => {
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );

  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  try {
    return await message.member.voice.channel.join();
  } catch (error) {
    console.log(error)
  }
}

const playMusic = async (message) => {
  if (!_activePlaylist) {
    message.channel.send("No playlists found, use !dbPlaylists");
  }

  const connection = await joinVoiceChannel(message);

  const dispatcher = connection
    .play(await ytdl(_activePlaylist[0].url, { filter: _ => ["251"], highWaterMark: 1 << 25 }), { type: 'opus' })
    .on("finish", () => {
      _activePlaylist.shift();
      message.channel.send(`---------  No responses  ---------`);
      playMusic(message);
    })
    .on("error", error => console.error(error));
  dispatcher.setVolumeLogarithmic(5 / 5);
  // const m = await message.channel.send(`Start playing: **${_activePlaylist[0].title}**`);
  const m = await message.channel.send(`Track is playing 🎶`);

  const filter = m => !m.author.bot;

  const collector = m.channel.createMessageCollector(filter, { time: 30000 });
  collector.on('collect', m => {
    console.log(_activePlaylist[0])
    if (_activePlaylist[0].correctWords.includes(m.content)) {
      // m.delete()
      message.channel.send(`✅ Got it with ${message.content}`);
      message.channel.send(`The song was ${_activePlaylist[0].title}`)
      message.channel.send(_activePlaylist[0].url)
    } else {
      m.reply(`Failed with ${m.content}`)
    } 
  });
  
  collector.on('end', collected => {
    message.channel.send(`Time's up`);
  });
}

const manageTags = async (message, limit, page) => {
  const data = await request(_prodEnv, GET_TAGS, { limit, page })

  const f = data.tags.docs.map((p, i) => ({ name: `Press ${getUnicode(i + 1)} to get :`, value: `${p.name}` }))
  const m = await message.channel.send({
    embed: {
      color: "#ec4999",
      title: `Tags - Page ${page}/${data.tags.totalPages}`,
      url: "https://yu-client.vercel.app/tags",
      description: "bla bla bla description, how to use it",
      fields: f,
      timestamp: new Date(),
    }
  })

  if (data.tags.hasPrevPage) {
    m.react("⬅️")
  }
  f.forEach((e, i) => {
    m.react(getUnicode(i + 1))
  });
  if (data.tags.hasNextPage) {
    m.react("➡️")
  }

  const filter = (reaction, user) => {
    return _aReact.includes(reaction.emoji.name) && user.id === message.author.id;
  };


  m.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
    .then((collected) => {
      const reaction = collected.first();
      console.log(reaction.emoji.name)

      if (reaction.emoji.name === "➡️") {
        message.reply("Next")
        manageTags(message, 5, page + 1)
      } else if (reaction.emoji.name === "⬅️") {
        message.reply("Back")
        manageTags(message, 5, page - 1)
      } else {
        message.reply(`${data.tags.docs[getIndex(reaction.emoji.name) - 1].name} selected.`)
        _activePlaylist = data.tags.docs[getIndex(reaction.emoji.name) - 1];
        request(_prodEnv, GET_SONGS, { tag: data.tags.docs[getIndex(reaction.emoji.name) - 1]._id }).then((data) => _activePlaylist = data.songs)
      }

    })
}

const client = new Client();

client.once("ready", () => {
  console.log("---------- Bot ready ----------");
});

client.once("reconnecting", () => {
  console.log("---------- Bot reconnecting ----------");
});

client.once("disconnect", () => {
  console.log("---------- Bot disconnect ----------");
});

client.on("message", async message => {
  if (message.author.bot) {
    return;
  }
  if (!message.content.startsWith(config.prefix)) {
    return;
  }
  else if (message.content.startsWith(`${config.prefix}play`)) {
    playMusic(message);
    return;
  }
  else if (message.content.startsWith(`${config.prefix}info`)) {
    console.log(_activePlaylist)
    return;
  }
  else if (message.content.startsWith(`${config.prefix}blindtest`)) {
    manageTags(message, 5, 1);
    return;
  }
  else {
    message.channel.send("You need to enter a valid command!");
  }
});

client.login(config.token);
