const { gql } = require('graphql-request');
const {
  CORE_TRACK_FIELDS, CORE_USER_FIELDS, CORE_TAG_FIELDS,
} = require("../fragments");

exports.TRACKS = gql`
  query Tracks($tag: ID) {
    tracks(tag: $tag) {
      ...CoreTrackFields
      creator {
        ...CoreUserFields
      }
      tags {
        ...CoreTagFields
      }
    }
  }
  ${CORE_TRACK_FIELDS}
  ${CORE_USER_FIELDS}
  ${CORE_TAG_FIELDS}
`;
