import endGame from "../actions/endGame";
import playMusic from "./playMusic.mjs";

const skipMusic = async (message) => {
  if (_activePlaylist.length <= 0) {
    endGame(message);
  } else {
    playMusic(message);
  }
}

export default skipMusic;
