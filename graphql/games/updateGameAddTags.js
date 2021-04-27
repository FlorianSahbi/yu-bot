const { gql } = require('graphql-request');
const {
  CORE_TAG_FIELDS, CORE_GAME_FIELDS, CORE_ROUND_FIELDS, CORE_USER_FIELDS,
} = require("../fragments");

exports.UPDATE_GAME_ADD_TAGS = gql`
  mutation UpdateGameAddTags($id: ID, $tags: [ID]) {
    updateGameAddTags(id: $id, tags: $tags) {
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
