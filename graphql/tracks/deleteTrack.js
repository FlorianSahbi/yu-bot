const { gql } = require('graphql-request');

exports.DELETE_TRACK = gql`
  mutation DeleteTrack($id: ID) {
    deleteTrack(id: $id) {
      _id
    }
  }
`;
