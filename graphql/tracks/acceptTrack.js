const { gql } = require('graphql-request');

exports.ACCEPT_SONG = gql`
  mutation AcceptSong(
    $id: ID
  ) {
    acceptTrack(
      id: $id
    ) {
      _id
      isAccepted
    }
  }
`;
