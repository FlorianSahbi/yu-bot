import debuggerLog from "./utils/debuggerLog.mjs";

const color = "#ec4999";
const author = {
  name: 'Yu',
  icon_url: 'https://yu-client.vercel.app/yu.png',
  url: 'https://yu-client.vercel.app',
};

//////////////
// MESSAGES //
//////////////

export const sendHelpMessage = async (message) => {
  debuggerLog(new Date, "MS - messageService.sendHelpMessage", "Start");
  const helpMessageEmbed = {
    embed: {
      color,
      author,
      description: "Below you can see all the commands I know",
      fields: [
        {
          name: "Blind test",
          value: "Simply use `!g (Temp.)`",
        },
      ],
    }
  };
  const helpMessage = await message.channel.send(helpMessageEmbed);
  return helpMessage;
}

export const sendJoinMessage = async (message) => {
  debuggerLog(new Date, "MS - messageService.sendJoinMessage", "Start");
  const joinMessageEmbed = {
    embed: {
      color,
      author,
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
        {
          name: "Cancel",
          value: "React with 🚫 (Game author only)",
        },
      ],
    }
  };
  const joinMessage = await message.channel.send(joinMessageEmbed);
  joinMessage.react("👍");
  joinMessage.react("✅");
  joinMessage.react("🚫");
  return joinMessage;
}

export const sendTagsMessage = async (message, tags) => {
  debuggerLog(new Date, "MS - messageService.sendTagsMessage", "Start");
  const tagsMessageEmbed = {
    embed: {
      color,
      author,
      description: "Type `tag-name` to select it.",
      fields: [
        {
          name: "Tags",
          value: tags,
        },
      ],
    }
  }
  const tagsMessage = await message.channel.send(tagsMessageEmbed);
  return tagsMessage;
}

export const sendValidationMessage = async (message, tag) => {
  debuggerLog(new Date, "MS - messageService.sendValidationMessage", "Start");
  const validationMessageEmbed = {
    embed: {
      color,
      author,
      description: `${message.author.username} has selected \`${tag.name}\``,
      image: {
        url: tag.cover,
      },
    }
  };
  const validationMessage = await message.channel.send(validationMessageEmbed);
  return validationMessage;
}

export const sendRecapMessage = async (message, goal, time, tag, tagCover, players) => {
  debuggerLog(new Date, "MS - messageService.sendRecapMessage", "Start");
  const recapMessageEmbed = {
    embed: {
      author,
      color,
      description: "Game settings",
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
          name: "Players",
          value: players
        },
        {
          name: "Theme",
          value: tag,
        },
        {
          name: "Ok with it ?",
          value: "React with ✅ to confirm or 🚫 to cancel (Game author only)",
        },
      ],
      image: {
        url: tagCover,
      }
    }
  };
  const recapMessage = await message.channel.send(recapMessageEmbed);
  recapMessage.react("✅");
  recapMessage.react("🚫");
  return recapMessage;
}

export const sendSongPlayingMessage = async (message, round, score) => {
  debuggerLog(new Date, "MS - messageService.sendSongPlayingMessage", "Start");
  const songPlayingMessageEmbed = {
    embed: {
      color,
      author,
      title: `Round : ${round} - Track is playing 🎶`,
      fields: score.map((score) => ({ name: score.player.username, value: `${score.points}pts` })),
    }
  };
  const songPlayingMessage = await message.channel.send(songPlayingMessageEmbed);
  return songPlayingMessage;
}

export const sendSongMessage = async (message, title, cover, url) => {
  debuggerLog(new Date, "MS - messageService.sendSongMessage", "Start");
  const songMessageEmbed = {
    embed: {
      color,
      title: `The song was : ${title}`,
      url: url,
      thumbnail: {
        url: cover,
      },
    }
  };
  const songMessage = await message.channel.send(songMessageEmbed);
  return songMessage;
}

export const sendRoundMessage = async (message, lb) => {
  debuggerLog(new Date, "MS - messageService.sendEndGameMessage", "Start");
  const fi = lb.getLeaderboard.map(rank => ({ name: rank.player.username, value: rank.points }))
  const roundMessageEmbed = {
    embed: {
      color,
      author,
      description: "END",
      fields: fi,
      timestamp: new Date(),
      footer: {
        text: 'Thank you for using Yu 🌸',
      },
    }
  };
  const roundMessage = await message.channel.send(roundMessageEmbed);
  return roundMessage;
}

export const sendEndGameMessage = async (message, lb) => {
  debuggerLog(new Date, "MS - messageService.sendEndGameMessage", "Start");

  const endGameMessageEmbed = {
    embed: {
      color,
      author,
      description: "END",
      fields: lb.map(b => ({ name: b.player.username, value: `${b.points}pts` })),
      timestamp: new Date(),
      footer: {
        text: 'Thank you for using Yu 🌸',
      },
    }
  };
  const endGameMessage = await message.channel.send(endGameMessageEmbed);
  endGameMessage.react("👏");
  return endGameMessage;
}
