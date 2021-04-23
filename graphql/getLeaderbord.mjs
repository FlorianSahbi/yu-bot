import {gql} from 'graphql-request';
import {CORE_USER_FIELDS} from "./fragments.mjs";

const GET_LEADERBOARD = gql`
  query GetLeaderboard($gameId: ID) {
    getLeaderboard(gameId: $gameId) {
      player {
        ...CoreUserFields
      }
      points
    }
  }
  ${CORE_USER_FIELDS}
`;

export default GET_LEADERBOARD;
