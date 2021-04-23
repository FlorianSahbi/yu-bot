import debuggerLog from "../debuggerLog.mjs";

const sendErrorMessage = async (channel, description) => {
  try {
    const error = { embed: { color: "#ff0000", description } };
    const errorMessage = await channel.send(error);
  } catch (error) {
    debuggerLog(new Date(), "sendErrorMessage", error);
  }
}

export default sendErrorMessage;
