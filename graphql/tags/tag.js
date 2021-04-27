const { gql } = require('graphql-request');
const {
  CORE_TAG_FIELDS, CORE_USER_FIELDS, CORE_TRACK_FIELDS,
} = require("../fragments");

exports.TAG = gql`
  query Tag($id: ID) {
    tag(id: $id) {
      ...CoreTagFields
      tracks {
        ...CoreTrackFields
      }
      creator {
        ...CoreUserFields
      }
    }
  }
  ${CORE_TAG_FIELDS}
  ${CORE_USER_FIELDS}
  ${CORE_TRACK_FIELDS}
`;
