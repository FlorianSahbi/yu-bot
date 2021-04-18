import {gql} from 'graphql-request';
import {CORE_TAG_FIELDS, PAGINATION_FIELDS} from "../fragments.mjs";

const GET_TAGS = gql`
  query Tags($limit: Int, $page: Int) {
    tags(limit: $limit, page: $page) {
      ...PaginationFields
      docs {
        ...CoreTagFields
      }
    }
  }
  ${PAGINATION_FIELDS}
  ${CORE_TAG_FIELDS}
`;

export default GET_TAGS;
