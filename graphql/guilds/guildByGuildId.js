const { gql } = require('graphql-request');
const {
  CORE_TAG_FIELDS, CORE_USER_FIELDS, CORE_TRACK_FIELDS,
} = require("../fragments");

exports.GUILD_BY_GUILD_ID = gql`
query GuildByGuildId($id: ID) {
    guildByGuildId(id: $id) {
      isPlaying
      id
      users {
        _id
        username
      }
      name
    }
  }
`;
