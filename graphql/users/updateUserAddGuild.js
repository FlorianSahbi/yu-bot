const { gql } = require('graphql-request');

exports.UPDATE_USER_ADD_GUILD = gql`
  mutation UpdateUserAddGuild($id: ID, $guildId: ID) {
    updateUserAddGuild(id: $id, guildId: $guildId) {
      _id
    }
  }
`;
