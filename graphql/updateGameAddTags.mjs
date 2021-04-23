import { gql } from 'graphql-request';
import { CORE_HISTORY_FIELDS, CORE_TAG_FIELDS, CORE_USER_FIELDS, CORE_GAME_FIELDS } from "./fragments.mjs";

const UPDATE_GAME_ADD_TAGS = gql`
  mutation UpdateGameAddTags($id: ID, $tags: [ID]) {
    updateGameAddTags(id: $id, tags: $tags) {
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

export default UPDATE_GAME_ADD_TAGS;
