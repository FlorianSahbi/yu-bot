const { gql } = require('graphql-request');
const {
  CORE_GAME_FIELDS, CORE_TAG_FIELDS, CORE_USER_FIELDS, CORE_ROUND_FIELDS,
} = require("../fragments");

exports.CREATE_GAME = gql`
  mutation CreateGame {
    createGame {
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
  ${CORE_GAME_FIELDS}
  ${CORE_TAG_FIELDS}
  ${CORE_USER_FIELDS}
  ${CORE_ROUND_FIELDS}
`;
