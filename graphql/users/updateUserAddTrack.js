const { gql } = require('graphql-request');

exports.UPDATE_USER_ADD_TRACK = gql`
  mutation UpdateUserAddTrack($id: ID, $trackId: ID) {
    updateUserAddTrack(id: $id, trackId: $trackId) {
      _id
    }
  }
`;
