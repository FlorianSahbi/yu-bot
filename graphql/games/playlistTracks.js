const { gql } = require('graphql-request');
const {
  CORE_TRACK_FIELDS
} = require("../fragments");

exports.PLAYLIST_TRACKS = gql`
  query PlaylistTracks($tag: ID) {
    playlistTracks(tag: $tag) {
      ...CoreTrackFields
    }
  }
  ${CORE_TRACK_FIELDS}
`;
