const { gql } = require('graphql-request');
const {
  CORE_TAG_FIELDS, CORE_USER_FIELDS, CORE_TRACK_FIELDS,
} = require("../fragments");

exports.GUILD = gql`
  query Guild($id: ID) {
    guild(id: $id) {
      _id
    }
  }
`;
