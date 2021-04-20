import {gql} from 'graphql-request';
import { CORE_HISTORY_FIELDS, CORE_TAG_FIELDS, CORE_USER_FIELDS, CORE_GAME_FIELDS } from "./fragments.mjs";

const UPDATE_AND_ADD = gql`
  mutation UpdateAndAdd($discordIds: [String], $id: ID) {
    updateAndAdd(discordIds: $discordIds, id: $id){
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

export default UPDATE_AND_ADD;
