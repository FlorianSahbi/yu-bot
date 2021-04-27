const { gql } = require('graphql-request');
const {
  CORE_TRACK_FIELDS, CORE_USER_FIELDS, CORE_TAG_FIELDS,
} = require("../fragments");

exports.CREATE_TRACKS = gql`
    mutation CreateTracks($trackInputs: [trackInput]) {
    createTracks(trackInputs: $trackInputs) {
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
