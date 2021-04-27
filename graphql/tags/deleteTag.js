const { gql } = require('graphql-request');

exports.DELETE_TAG = gql`
  mutation DeleteTag($id: ID) {
    deleteTag(id: $id) {
      _id
    }
  }
`;
