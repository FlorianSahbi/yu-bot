import {gql} from 'graphql-request';

const GET_LEADERBOARD = gql`
  query GetLeaderboard($gameId: ID) {
      getLeaderboard(gameId: $gameId)
  }
`;

export default GET_LEADERBOARD;
