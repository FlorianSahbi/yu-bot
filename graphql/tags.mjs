import {gql} from 'graphql-request';

const GET_TAGS = gql`
  query Tags($limit: Int, $page: Int) {
    tags(limit: $limit, page: $page) {
      pagingCounter
      totalDocs
      limit
      totalPages
      page
      hasPrevPage
      hasNextPage
      docs {
        _id
        name
      }
    }
  }
`;

export default GET_TAGS;
