import {gql} from 'graphql-request';

export const CORE_HISTORY_FIELDS = gql`
  fragment CoreHistoryFields on Game {
    history {
      song {
        title
        cover
      }
      position
      rank {
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