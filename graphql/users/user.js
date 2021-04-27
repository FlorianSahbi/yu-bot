const { gql } = require('graphql-request');
const { CORE_USER_FIELDS, CORE_TRACK_FIELDS } = require("../fragments");

exports.USER = gql`
  query User($id: ID) {
    user(id: $id) {
      ...CoreUserFields
      tracks {
        ...CoreTrackFields
      }
    }
  }
  ${CORE_USER_FIELDS}
  ${CORE_TRACK_FIELDS}
`;
