import { gql } from 'graphql-request';
import {CORE_SONG_FIELDS} from "./fragments.mjs";

const GET_RANDOM_SONG = gql`
query GetRandomSong($tag: ID) {
    randomSong(tag: $tag) {
      ...CoreSongFields
    }
  }
  ${CORE_SONG_FIELDS}
`;

export default GET_RANDOM_SONG;
