const { gql } = require('graphql-request');
const {
  CORE_TAG_FIELDS, CORE_USER_FIELDS, CORE_TRACK_FIELDS,
} = require("../fragments");

exports.TAGS = gql`
  query Tags {
    tags {
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
