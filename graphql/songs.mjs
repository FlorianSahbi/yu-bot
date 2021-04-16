import {gql} from 'graphql-request';

const GET_SONGS = gql`
  query Songs($tag: ID) {
    songs(tag: $tag) {
      _id
      title
      cover
      url
      correctWords
    }
  }
`;

export default GET_SONGS;
