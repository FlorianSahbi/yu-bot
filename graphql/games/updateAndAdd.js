const { gql } = require('graphql-request');
const {
  CORE_TAG_FIELDS, CORE_GAME_FIELDS, CORE_ROUND_FIELDS, CORE_USER_FIELDS,
} = require("../fragments");

exports.UPDATE_AND_ADD = gql`
  mutation updateAndAdd($id: ID, $userDiscordData: [userDiscordData]) {
    updateAndAdd(id: $id, userDiscordData: $userDiscordData) {
      ...CoreGameFields
      tags {
        ...CoreTagFields
      }
      users {
        ...CoreUserFields
      }
      creator {
        ...CoreUserFields
      }
      history {
        ...CoreRoundFields
      }
    }
  }
  ${CORE_TAG_FIELDS}
  ${CORE_GAME_FIELDS}
  ${CORE_USER_FIELDS}
  ${CORE_ROUND_FIELDS}
`;
