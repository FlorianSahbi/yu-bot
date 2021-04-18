const leave = async (message) => {
  try {
    message.member.voice.channel.leave();
    _connection = null;
  } catch (error) {
  }
}

export default leave;
