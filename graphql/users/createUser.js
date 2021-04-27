const { gql } = require('graphql-request');
const { CORE_USER_FIELDS, CORE_TRACK_FIELDS } = require("../fragments");

exports.CREATE_USER = gql`
  mutation CreateUser($username: String, $avatar: String, $discordId: String) {
    createUser(
      userInput: { username: $username, avatar: $avatar, discordId: $discordId }
    ) {
      ...CoreUserFields
      tracks {
        ...CoreTrackFields
      }
    }
  }
  ${CORE_USER_FIELDS}
  ${CORE_TRACK_FIELDS}
`;
