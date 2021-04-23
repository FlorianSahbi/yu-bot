import {gql} from 'graphql-request';

export const CORE_HISTORY_FIELDS = gql`
  fragment CoreHistoryFields on Game {
    history {
      _id
      song {
        title
        cover
      }
      position
      rank {
        _id
        position
        player {
          _id
          username
        }
        points
      }
    }
  }
`;

export const CORE_TAG_FIELDS = gql`
  fragment CoreTagFields on Tag {
    _id
    name
    cover
  }
`;

export const CORE_ROUND_FIELDS = gql`
  fragment CoreRoundFields on Tag {
    _id
    position
    song {
      _id
      title
    }
    rank {
      _id
      position
      points
      user {
        _id
        username
      }
    }
  }
`;

export const CORE_RANK_FIELDS = gql`
  fragment CoreRankFields on Tag {
    _id
    position
    points
    user {
      _id
      username
    }
  }
`;

export const CORE_GAME_FIELDS = gql`
  fragment CoreGameFields on Game {
    _id
    name
    points
    trackTime
  }
`;

export const CORE_USER_FIELDS = gql`
  fragment CoreUserFields on User {
    _id
    username
    avatar
    discordId
  }
`;

export const CORE_SONG_FIELDS = gql`
  fragment CoreSongFields on Song {
    _id
    title
    url
    cover
    correctWords
  }
`;

export const PAGINATION_FIELDS = gql`
  fragment PaginationFields on TagConnection {
    pagingCounter
    totalDocs
    limit
    totalPages
    page
    hasPrevPage
    hasNextPage
  }
`;