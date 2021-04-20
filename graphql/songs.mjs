import {gql} from 'graphql-request';
import {CORE_SONG_FIELDS} from "./fragments.mjs";

const GET_SONGS = gql`
  query Songs($tag: ID) {
    songs(tag: $tag) {
     ...CoreSongFields
    }
  }
  ${CORE_SONG_FIELDS}
`;

export default GET_SONGS;
