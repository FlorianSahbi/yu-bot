const { gql } = require('graphql-request');
const {
  CORE_TRACK_FIELDS
} = require("../fragments");

exports.RANDOM_TRACK = gql`
  query RandomTrack($tag: ID) {
    randomTrack(tag: $tag) {
      ...CoreTrackFields
    }
  }
  ${CORE_TRACK_FIELDS}
`;
