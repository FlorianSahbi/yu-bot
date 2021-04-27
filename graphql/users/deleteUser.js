const { gql } = require('graphql-request');

exports.DELETE_USER = gql`
  mutation DeleteUser($id: ID) {
    deleteUser(id: $id) {
      _id
    }
  }
`;
