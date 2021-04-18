import { gql } from 'graphql-request';
import {CORE_USER_FIELDS} from "../fragments.mjs";

const GET_USERS = gql`
  query Users {
    users {
      ...CoreUserFields
    }
  }
  ${CORE_USER_FIELDS}
`;

export default GET_USERS;
