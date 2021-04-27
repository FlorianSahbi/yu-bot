const joinVoiceChannel = async (message) => {
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
    console.error(error);
  }
}

export default joinVoiceChannel;
