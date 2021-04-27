const { gql } = require('graphql-request');
const { CORE_USER_FIELDS, CORE_TRACK_FIELDS } = require ("../fragments");

exports.USERS = gql`
  query Users {
    users {
      ...CoreUserFields
      tracks {
        ...CoreTrackFields
      }
    }
  }
  ${CORE_USER_FIELDS}
  ${CORE_TRACK_FIELDS}
`;
