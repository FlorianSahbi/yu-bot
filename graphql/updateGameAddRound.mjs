import { gql } from 'graphql-request';
import { CORE_HISTORY_FIELDS, CORE_TAG_FIELDS, CORE_USER_FIELDS, CORE_GAME_FIELDS } from "../fragments.mjs";

const UPDATE_GAME_ADD_ROUND = gql`
  mutation UpdateGameAddRound($id: ID, $positionRound: Int, $song: ID) {
    updateGameAddRound(id: $id, positionRound: $positionRound, song: $song) {
      ...CoreGameFields
      players {
        ...CoreUserFields
      }
      tags {
        ...CoreTagFields
      }
      ...CoreHistoryFields
    }
  }
  ${CORE_HISTORY_FIELDS}
  ${CORE_TAG_FIELDS}
  ${CORE_USER_FIELDS}
  ${CORE_GAME_FIELDS}
`;

export default UPDATE_GAME_ADD_ROUND;
