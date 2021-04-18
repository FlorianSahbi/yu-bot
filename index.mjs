import { Client } from "discord.js";
import config from "./config.json";
import ytdl from "ytdl-core-discord";
import sleep from "./utils/sleep.mjs";
import { request } from 'graphql-request';
import GET_SONGS from "./graphql/songs.mjs";
import GET_RANDOM_SONG from "./graphql/getRandomSong.mjs";
import GET_TAGS from "./graphql/tags.mjs";
import GET_USERS from "./graphql/users.mjs";
import ADD_GAME from "./graphql/addGame.mjs";
import GET_GAME from "./graphql/getGame.mjs";
import UPDATE_GAME from "./graphql/updateGame.mjs";


// request(process.env.YU_API, GET_SONGS, { tag: tag._id })
// .then((data) => _activePlaylist = data.songs)

const g = async (message) => {
  const { addGame } = await request(process.env.YU_API, ADD_GAME, { players: [], tags: [] })
  askJoin(message, addGame, true);
}

// input: nothing
// output : { id: string, username: string, avatar: string || null }
const askJoin = async (message, game, debug) => {
  const gameData = game;
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
  })

  await joinMessage.react("👍");
  await joinMessage.react("✅");

  const filter = (reaction, user) => {
    return (reaction.emoji.name === "👍" && !user.bot) || (reaction.emoji.name === "✅" && !user.bot && user.id === message.author.id);
  };

  const collector = await joinMessage.createReactionCollector(filter);

  collector.on('collect', (reaction) => {
    if (reaction.emoji.name === "✅") {
      collector.stop();
    }
    if (!debug) {
      manageTags(message);
    }
  });

  collector.on('end', async collected => {
    // list of discordID of users
    const players = await collected.first().users.cache.filter(user => !user.bot).map(({ id }) => id);
    // list of user in db
    const playersDB = await request(process.env.YU_API, GET_USERS)

    const playerDbIdInGame = playersDB.users.filter(p => players.includes(p.discordId)).map(p => p._id)
    if (players.length <= 0) {
      message.channel.send("No enough players, END") // Todo beautiful message d'erreur
    } else {
      const ppp = await request(process.env.YU_API, UPDATE_GAME, { id: gameData._id, tags: [], players: playerDbIdInGame })
      manageTags(message, ppp)
    }
  });
}



// input: Players : { id: string, username: string, avatar: string || null }
// output : Tags : { id: string, name: string }
const manageTags = async (message, game) => {
  const gameData = game;
  const { tags: { docs } } = await request(process.env.YU_API, GET_TAGS)
  const tagsList = docs.map((p) => `\`${p.name}\``).join(", ")
  const tagMessage = await message.channel.send({
    embed: {
      color: "#ec4999",
      fields: [
        {
          name: "Tags",
          value: tagsList,
        },
      ],
    }
  })

  const filter = m => !m.author.bot && m.author.id === message.author.id;

  const collector = tagMessage.channel.createMessageCollector(filter, { time: 30000 });

  collector.on('collect', async (message) => {
    if (docs.map(({ name }) => name).includes(message.content)) {
      const tag = await docs.find(({ name }) => name === message.content);
      message.delete();
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

      const variables = { id: gameData.updateGame._id, tags: [tag._id], players: [...gameData.updateGame.players.map(p => p._id)] };

      const ppp = await request(process.env.YU_API, UPDATE_GAME, variables)

      await collector.stop();
      showSettings(message, ppp)
    } else {
      message.reply(`${message.content} does not exists`);
    }
  });

  collector.on('end', async collected => {
    if (collected.length <= 0) {
      message.channel.send("30sec inactivity")
    } else {
      await message.channel.send("next")
    }
  });
}

const showSettings = async (message, game) => {
  const gameData = game;
  const variables = { id: gameData.updateGame._id };
  const data = await request(process.env.YU_API, GET_GAME, variables)
  const m = await message.channel.send({
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
          name: "Object",
          value: data.game.name,
        },
        {
          name: "Time to guess",
          value: `${data.game.trackTime / 1000}s`,
        },
        {
          name: "Theme",
          value: data.game.tags[0].name,
        },
        {
          name: "Players",
          value: data.game.players.map(p => p.username).join(", ")
        },
        {
          name: "Ok with it ?",
          value: "React with ✅ (Game author only)",
        },
      ],
    }
  })

  m.react("✅");

  const filter = (reaction, user) => {

    return reaction.emoji.name === "✅" && !user.bot;
  };

  const collector = m.createReactionCollector(filter, { max: 1, time: 15000 });

  collector.on('collect', (reaction, user) => {
    console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
    lookingForSound(message, data);
  });

  collector.on('end', collected => {

  });
}

const lookingForSound = async (message, game) => {
  message.channel.send("Looking for track")
  const g = game.game
  console.log(g)
  console.log(game)
  const song = await request(process.env.YU_API, GET_RANDOM_SONG, { tag: g.tags[0]._id })
  console.log(song)
  playMusic(message, song, game)
}

const score = async (message, user, stats = []) => {
  if (stats.length <= 0) {
    stats = [...stats, { user, points: 30 }]
  } else if (stats.length = 1) {
    stats = [...stats, { user, points: 20 }]

  } else if (stats.length = 2) {
    stats = [...stats, { user, points: 10 }]

  } else {
    stats = [...stats, { user, points: 5 }]
  }
  return stats;
}

const playMusic = async (message, song, game) => {
  console.log("start musique")
  console.log(song.randomSong.url)
  const connection = await joinVoiceChannel(message);

  const dispatcher = await connection
    .play(await ytdl(song.randomSong.url, { filter: _ => ["251"], highWaterMark: 1 << 25, quality: "highestaudio" }), { type: 'opus' })
    .on("finish", () => {
      dispatcher.end();
      lookingForSound(message, game)
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

      if (!nexS) {
        const nexS = await score(message, m.author, []);
      } else {
        await score(message, m.author, nexS);
      }
      console.log(nexS)
    }
  });

  collector.on('end', async () => {
    // await sendRecap(message, _activePlaylist);
    // await _activePlaylist.shift();
    timer.delete();
    dispatcher.end();
  });
}

const sendRecap = async (message, p) => {
  // description: `The song was ${_activePlaylist[0].title}`
  await message.channel.send({
    embed: {
      color: "#ec4999",
      description: "The song was Ben Böhmer & Timo Jahns - Lifespan"
    }
  })
  await message.channel.send(_activePlaylist[0].url)
}

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
  }
}

const endGame = async (message) => {
  const m = await message.channel.send({
    embed: {
      description: "Game finished",
      author: {
        name: 'Yu',
        icon_url: 'https://yu-client.vercel.app/yu.png',
        url: 'https://yu-client.vercel.app',
      },
      color: "#ec4999",
      fields: [
        {
          name: "Rank",
          value: "1st to last",
        },
        {
          name: "1/7 : Beelphiew#0000",
          value: "102pts",
        },
        {
          name: "2/7 : Dral#0000",
          value: "82pts",
        },
        {
          name: "3/7 : Flo#0000",
          value: "62pts",
        },
        {
          name: "4/7 : Lolibam#0000",
          value: "42pts",
        },
        {
          name: "5/7 : Orsk#0000",
          value: "22pts",
        },
        {
          name: "6/7 : Tenshi#0000",
          value: "2pts",
        },
        {
          name: "7/7 : Vikanya#0000",
          value: "0pts",
        },
      ],
      timestamp: new Date(),
      footer: {
        text: 'Thank you for using Yu 🌸',
      },
    }
  })
  m.react("👏");
}

const skipMusic = async (message) => {
  if (_activePlaylist.length <= 0) {
    endGame(message);
  } else {
    playMusic(message);
  }
}

const sendHelp = async (message) => {
  message.channel.send({
    embed: {
      description: "Below you can see all the commands I know",
      author: {
        name: 'Yu',
        icon_url: 'https://yu-client.vercel.app/yu.png',
        url: 'https://yu-client.vercel.app',
      },
      color: "#ec4999",
      fields: [
        {
          name: "Blind test",
          value: "Simply use `!blindtest`",
        },
      ],
    }
  })
}

const leave = async (message) => {
  try {
    message.member.voice.channel.leave();
    _connection = null;
  } catch (error) {
  }
}

const client = new Client();

client.once("ready", () => {
  console.log(`${Date.now()} : Ready`)
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
  else if (message.content.startsWith(`${config.prefix}yu`)) {
    sendHelp(message);
    return;
  }
  else if (message.content.startsWith(`${config.prefix}play`)) {
    playMusic(message);
    return;
  }
  else if (message.content.startsWith(`${config.prefix}blindtest`)) {
    askJoin(message);
    return;
  }
  else if (message.content.startsWith(`${config.prefix}leave`)) {
    leave(message);
    return;
  }
  else if (message.content.startsWith(`${config.prefix}askJoin`)) {
    askJoin(message, true);
    return;
  }
  else if (message.content.startsWith(`${config.prefix}askSettings`)) {
    showSettings(message);
    return;
  }
  else if (message.content.startsWith(`${config.prefix}rich`)) {
    // const exampleEmbed = {
    //   color: 0x0099ff,
    //   title: 'The Witcher 3: Blood and Wine - The Banks of the Sansretour',
    //   url: 'https://www.youtube.com/watch?v=hvMfdI6ZxPw',
    //   author: {
    //     name: 'Yu',
    //     icon_url: 'https://yu-client.vercel.app/yu.png',
    //     url: 'https://yu-client.vercel.app',
    //   },
    //   image: {
    //     url: 'https://i.ytimg.com/vi/b7YtrkeSMGs/maxresdefault.jpg',
    //   },
    //   timestamp: new Date(),
    //   footer: {
    //     text: 'lien vers musique',
    //     icon_url: 'https://yu-client.vercel.app/yu.png',
    //   },
    // };
    const exampleEmbed = {
      color: "#ec4999",
      description: "The song was Ben Böhmer & Timo Jahns - Lifespan"
    };
    message.channel.send({ embed: exampleEmbed });
    const link = await message.channel.send("https://www.youtube.com/watch?v=hvMfdI6ZxPw");

    return;
  }
  else if (message.content.startsWith(`${config.prefix}tag`)) {
    manageTags(message, {})
    return;
  }
  else if (message.content.startsWith(`${config.prefix}g`)) {
    g(message)
    return;
  }
  else {
    message.channel.send("You need to enter a valid command!");
  }
});

client.login(process.env.YU_TOKEN || config.token);
