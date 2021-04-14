import { Client } from "discord.js";
import config from "./config.json";
import playlist from "./playlist_test.mjs";
import ytdl from "ytdl-core-discord";
import { request, gql } from 'graphql-request';

global._prodEnv = "https://yu-server.herokuapp.com/";
global._devEnv = "http://localhost:4000/";

const query = gql`
  query {
    playlists {
      _id
      name
      thumbnail
      songs {
        _id
        title
        url
        cover
      }
    }
  }
`

const queryTags = gql`
  query {
    tags {
      _id
      name
    }
  }
`

const GET_SONGS = gql`
  query Songs($tag: ID) {
    songs(tag: $tag) {
      _id
      title
      cover
      url
    }
  }
`;

global._aReact = [
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣"
]

function getUnicode(i) {
  switch (i) {
    case 1: return "1️⃣";
    case 2: return "2️⃣";
    case 3: return "3️⃣";
    case 4: return "4️⃣";
    case 5: return "5️⃣";
    case 6: return "6️⃣";
    case 7: return "7️⃣";
    case 8: return "8️⃣";
    case 9: return "9️⃣";
    default: return "9️⃣";
  }
}

function getIndex(unicode) {
  switch (unicode) {
    case "1️⃣": return 1;
    case "2️⃣": return 2;
    case "3️⃣": return 3;
    case "4️⃣": return 4;
    case "5️⃣": return 5;
    case "6️⃣": return 6;
    case "7️⃣": return 7;
    case "8️⃣": return 8;
    case "9️⃣": return 9;
    default: return 9;
  }
}

global._activePlaylist = null;


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

const initBlindTest = async (message) => {
  const game = {
    guildId: message.guild.id,
    textChannel: message.channel,
    voiceChannel: message.member.voice.channel,
    connection: await joinVoiceChannel(message),
    songs: playlist,
    players: [{
      id: message.author.id,
      username: message.author.username,
      points: 0
    }],
    volume: 5,
    playing: true
  };
  playMusic(game, message);
}

const leaveVoiceChannel = (message) => {
  try {
    message.member.voice.channel.leave();
    _connection = null;
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
  message.channel.send(`Start playing: **${_activePlaylist[0].title}**`);
}

const skipMusic = (message) => {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue) {
    return message.channel.send("There is no song that I could skip!");
  }
  serverQueue.connection.dispatcher.end();
  _cpt = _cpt + 1;
  playMusic(message, _cpt);
}

const stopMusic = (message) => {
  _dispatcher.destroy();
  message.channel.send("Music stopped");
}

const guessMusic = async (message) => {
  if (!_dispatcher) {
    message.channel.send("You need to start a game before!");
    return;
  }

  const word = message.content.substr(7);
  const msg = await message.delete();

  if (playlist[_cpt].title === word) {
    msg.channel.send(`${message.author.username} got it with : ${word}`);
    _players[0].points = _players[0].points + 1;
    skipMusic(msg);
  } else {
    msg.channel.send(`${message.author.username} says ${word} but it's wrong`);
  }
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

  if (message.content.startsWith(`${config.prefix}join`)) {
    joinVoiceChannel(message);
    return;
  }

  else if (message.content.startsWith(`${config.prefix}leave`)) {
    leaveVoiceChannel(message);
    return;
  }

  else if (message.content.startsWith(`${config.prefix}play`)) {
    playMusic(message);
    return;
  }

  else if (message.content.startsWith(`${config.prefix}skip`)) {
    skipMusic(message);
    return;
  }

  else if (message.content.startsWith(`${config.prefix}stop`)) {
    stopMusic(message);
    return;
  }

  else if (message.content.startsWith(`${config.prefix}blindtest`)) {
    initBlindTest(message);
    return;
  }

  else if (message.content.startsWith(`${config.prefix}info`)) {
    console.log(_activePlaylist)
    return;
  }

  else if (message.content.startsWith(`${config.prefix}tags`)) {
    // const data = await request('https://yu-server.herokuapp.com', queryTags)
    const data = await request(_prodEnv, queryTags)
  
    const f = data.tags.map((p, i) => ({ name: `Press ${getUnicode(i + 1)} to get :`, value: `${p.name}` }))
    const m = await message.channel.send({
      embed: {
        color: "#ec4999",
        title: "Playlists",
        url: "https://yu-client.vercel.app/playlists",
        description: "bla bla bla description, how to use it",
        fields: f,
        timestamp: new Date(),
      }
    })

    f.forEach((e, i) => {
      m.react(getUnicode(i + 1))
    });



    const filter = (reaction, user) => {
      return _aReact.includes(reaction.emoji.name) && user.id === message.author.id;
    };

    m.awaitReactions(filter, { max: 1, time: 30000, errors: ['time'] })
      .then(collected => {
        const reaction = collected.first();
        message.reply(`${data.tags[getIndex(reaction.emoji.name) - 1].name} selected.`)
        _activePlaylist = data.tags[getIndex(reaction.emoji.name) - 1];
        request(_prodEnv, GET_SONGS, {tag: data.tags[getIndex(reaction.emoji.name) - 1]._id}).then((data) => _activePlaylist = data.songs)
      })
      .catch(collected => {
        message.reply("Aborted.");
      });



    return;
  }

  else if (message.content.startsWith(`${config.prefix}guess`)) {
    guessMusic(message);
    return;
  }

  else {
    message.channel.send("You need to enter a valid command!");
  }
});

client.login(config.token);




