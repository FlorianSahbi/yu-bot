const { gql } = require('graphql-request');
const {
  CORE_TRACK_FIELDS, CORE_USER_FIELDS, CORE_TAG_FIELDS,
} = require("../fragments");

exports.CREATE_TRACK = gql`
    mutation CreateTrack(
    $title: String
    $videoUrl: String
    $videoId: String
    $lengthSeconds: String
    $category: String
    $ownerChannelName: String
    $answers: [String]
    $keywords: [String]
    $thumbnail: String
    $creator: ID
    $tags: [ID]
  ) {
    createTrack(
      trackInput: {
        title: $title
        videoUrl: $videoUrl
        videoId: $videoId
        lengthSeconds: $lengthSeconds
        category: $category
        ownerChannelName: $ownerChannelName
        answers: $answers
        keywords: $keywords
        thumbnail: $thumbnail
        creator: $creator
        tags: $tags
      }
    ) {
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
