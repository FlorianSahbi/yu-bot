const { gql } = require('graphql-request');

exports.UPDATE_USER_ADD_GAME = gql`
  mutation UpdateUserAddGame($id: ID, $gameId: ID) {
    updateUserAddGame(id: $id,gameId: $gameId) {
      _id
    }
  }
`;
