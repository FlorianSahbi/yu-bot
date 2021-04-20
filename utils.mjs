import debuggerLog from "./utils/debuggerLog.mjs";

///////////
// UTILS //
///////////

export const joinVoiceChannel = async (message) => {
  debuggerLog(new Date, "NN - joinVoiceChannel", "Start");
  if (!message.member.voice.channel) {
    message.channel.send("You need to be in a voice channel to play music!");
  }

  const permissions = message.member.voice.channel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    message.channel.send("I need the permissions to join and speak in your voice channel!");
  }

  try {
    return await message.member.voice.channel.join();
  } catch (error) {
    debuggerLog(new Date, "Error - joinVoiceChannel", error);
  }
}

export const leaveVoiceChannel = async (message) => {
  debuggerLog(new Date, "NN - leaveVoiceChannel", "Start");
  try {
    message.member.voice.channel.leave();
    _connection = null;
  } catch (error) {
    debuggerLog(new Date, "Error - leaveVoiceChannel", error);
  }
}

export const getPoints = (number) => {
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
