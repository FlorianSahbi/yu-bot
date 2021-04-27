const { gql } = require('graphql-request');

exports.YOUTUBE_DATA = gql`
  query YoutubeData($youtubeUrls: [String]) {
    youtubeData(youtubeUrls: $youtubeUrls) {
      title
      keywords
      videoUrl
      thumbnails {
        url
        width
        height
      }
      lengthSeconds
      category
      ownerChannelName
      videoId
    }
  }
`;
