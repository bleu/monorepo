import { gql } from "graphql-tag";

export const poolWhereId = gql`
  query MetadataPool($poolId: ID) {
    pools(where: { id: $poolId }) {
      id
      address
      metadataCID
    }
  }
`;
