const { gql } = require('graphql-request');

exports.DELETE_GAME = gql`
  mutation DeleteGame($id: ID) {
    deleteGame(id: $id) {
      _id
    }
  }
`;
