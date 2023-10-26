import { capitalize, networkFor } from "@bleu-balancer-tools/utils";

import { Swap } from "#/lib/gql/server";
import { truncateAddress } from "#/utils/truncate";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OrdersTable({ orders }: { orders: Swap[] }) {
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
            <td>{item.tokenIn.id}</td>
            <td>{item.tokenOut.id}</td>
            <td>{truncateAddress(item.transactionHash)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
