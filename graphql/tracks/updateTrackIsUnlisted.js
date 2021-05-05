const { gql } = require("graphql-request");

exports.UPDATE_TRACK_IS_UNLISTED = gql`
  mutation UpdateTrackIsUnlisted($id: ID, $isUnlisted: Boolean) {
    updateTrackIsUnlisted(id: $id, isUnlisted: $isUnlisted) {
      _id
    }
  }
`;
