const { gql } = require('graphql-request');

exports.CORE_TRACK_FIELDS = gql`
  fragment CoreTrackFields on Track {
    _id
    title
    videoUrl
    videoId
    playCount
    lengthSeconds
    category
    ownerChannelName
    isAccepted
    thumbnail
    answers
    keywords
    createdAt
    updatedAt 
  }
`;

exports.CORE_TAG_FIELDS = gql`
  fragment CoreTagFields on Tag {
    _id
    name
    playCount
    isCustom
    thumbnail
    createdAt
    updatedAt
  }
`;

exports.CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    _id
    username
    avatar
    discordId
    playCount
    createdAt
    updatedAt
  }
`;

exports.CORE_GAME_FIELDS = gql`
  fragment CoreGameFields on Game {
    _id
    name
    goal
    trackTime
    createdAt
    updatedAt 
  }
`;

exports.CORE_ROUND_FIELDS = gql`
  fragment CoreRoundFields on Round {
    _id
    position
    createdAt
    updatedAt 
  }
`;

exports.CORE_RANK_FIELDS = gql`
  fragment CoreRankFields on Rank {
    _id
    position
    points
    createdAt
    updatedAt 
  }
`;

exports.CORE_LEADERBOARD_FIELDS = gql`
  fragment CoreLeaderboardFields on Leaderboard {
    points
  }
`;

exports.CORE_YOUTUBE_DATA_FIELDS = gql`
  fragment CoreYouTubeDataFields on Tag {
    title
    keywords
    videoUrl
    lengthSeconds
    category
    ownerChannelName
    videoId 
  }
`;
