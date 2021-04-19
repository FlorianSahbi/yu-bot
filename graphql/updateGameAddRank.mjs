import { gql } from 'graphql-request';
import { CORE_HISTORY_FIELDS, CORE_TAG_FIELDS, CORE_USER_FIELDS, CORE_GAME_FIELDS } from "../fragments.mjs";

const UPDATE_GAME_ADD_RANK = gql`
  mutation UpdateGameAddRank($id: ID, $round: Int, $position: Int, $player: ID, $points: Int) {
    updateGameAddRank(id: $id, round: $round, position: $position, player: $player, points: $points) {
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

export default UPDATE_GAME_ADD_RANK;
