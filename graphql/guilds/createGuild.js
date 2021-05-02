const { gql } = require("graphql-request");

exports.CREATE_GUILD = gql`
  mutation CreateGuild($guildInput: guildInput) {
    createGuild(guildInput: $guildInput) {
      isPlaying
      id
    }
  }
`;
