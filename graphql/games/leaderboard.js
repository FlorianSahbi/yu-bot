const { gql } = require('graphql-request');
const {
  CORE_USER_FIELDS,
} = require("../fragments");

exports.LEADERBOARD = gql`
  query Leaderboard($id: ID) {
    leaderboard(id: $id) {
      player {
        ...CoreUserFields
      }
      points
    }
  }
  ${CORE_USER_FIELDS}
`;
