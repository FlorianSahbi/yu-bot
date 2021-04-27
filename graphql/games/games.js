const { gql } = require('graphql-request');
const {
  CORE_TAG_FIELDS, CORE_GAME_FIELDS, CORE_ROUND_FIELDS, CORE_USER_FIELDS,
} = require("../fragments");

exports.GAMES = gql`
  query Games {
    games {
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
