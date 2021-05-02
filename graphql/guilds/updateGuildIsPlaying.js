const {gql} = require("graphql-request");

exports.UPDATE_GUILD_IS_PLAYING = gql`
  mutation UpdateGuildIsPlaying($id: ID, $isPlaying: Boolean) {
    updateGuildIsPlaying(id: $id, isPlaying:$isPlaying) {
      id
      isPlaying
    }
  }
`;
