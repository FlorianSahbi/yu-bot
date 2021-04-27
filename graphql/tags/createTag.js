const { gql } = require('graphql-request');
const {
  CORE_TAG_FIELDS, CORE_TRACK_FIELDS, CORE_USER_FIELDS,
} = require("../fragments");

exports.CREATE_TAG = gql`
  mutation CreateTag($tagInput: tagInput) {
    createTag(tagInput: $tagInput) {
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
  ${CORE_TRACK_FIELDS}
  ${CORE_USER_FIELDS}
`;
