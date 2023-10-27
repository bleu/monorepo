import { capitalize, networkFor } from "@bleu-balancer-tools/utils";
import { gql } from "graphql-tag";

import { sdk } from "#/gql/sdk";
import { truncateAddress } from "#/utils/truncate";

gql(`
  query AllSwaps {
    swaps {
      id
      chainId
      transactionHash
      priceChecker
      user {
        id
      }
      tokenIn {
        id
      }
      tokenOut {
        id
      }
    }
  }
`);

export async function OrdersTable() {
  const { swaps: orders } = await sdk.AllSwaps();

  if (!orders.length) {
    return null;
  }

  return (
    <table className="mt-5">
      <thead>
        <tr>
          <th>Chain ID</th>
          <th>Token In</th>
          <th>Token Out</th>
          <th>Transaction Hash</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((item, index) => (
          <tr key={index}>
            <td>{capitalize(networkFor(item.chainId))}</td>
            <td>{item.tokenIn?.id}</td>
            <td>{item.tokenOut?.id}</td>
            <td>{truncateAddress(item.transactionHash)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
