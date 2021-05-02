const { gql } = require('graphql-request');

exports.UPDATE_USER_ADD_TAG = gql`
  mutation UpdateUserAddTag($id: ID, $tagId: ID) {
    updateUserAddTag(id: $id, tagId: $tagId: ID) {
      _id
    }
  }
`;
