const { gql } = require('graphql-request');
const {
  CORE_TAG_FIELDS, CORE_GAME_FIELDS, CORE_ROUND_FIELDS, CORE_USER_FIELDS,
} = require("../fragments");

exports.UPDATE_GAME_ADD_PLAYERS = gql`
  mutation UpdateGameAddPlayers($id: ID, $users: [ID]) {
    updateGameAddPlayers(id: $id, users: $users) {
      ...CoreGameFields
      users {
        ...CoreUserFields
      }
      tags {
        ...CoreTagFields
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
