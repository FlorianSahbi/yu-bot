const { gql } = require('graphql-request');
const {
  CORE_TRACK_FIELDS, CORE_USER_FIELDS, CORE_TAG_FIELDS,
} = require("../fragments");

exports.TRACK = gql`
  query Track($id: ID) {
    track(id: $id) {
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
