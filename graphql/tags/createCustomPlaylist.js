const { gql } = require('graphql-request');
const {
  CORE_TAG_FIELDS, CORE_TRACK_FIELDS,
} = require("../fragments");

exports.CREATE_CUSTOM_PLAYLIST = gql`
  mutation CreateCustomPlaylist(
    $tagInput: tagInput
    $trackInputs: [trackInput]
  ) {
    createCustomPlaylist(
      tagInput: $tagInput
      trackInputs: $trackInputs
    ) {
      ...CoreTagFields
      tracks {
        ...CoreTrackFields
      }
    }
  }
  ${CORE_TAG_FIELDS}
  ${CORE_TRACK_FIELDS}
`;
