const debuggerLog = require("../debuggerLog");

exports.sendErrorMessage = async (channel, description) => {
  try {
    const error = { embed: { color: "#ff0000", description } };
    const errorMessage = await channel.send(error);
  } catch (error) {
    debuggerLog(new Date(), "sendErrorMessage", error);
  }
}
