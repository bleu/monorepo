import dynamic from "next/dynamic";

import { getAllOrders } from "#/lib/gql/server";

import { OrdersTable } from "./components/OrdersTable";

const AddressComponentWithNoSSR = dynamic(
  () => import("./components/WalletAddress"),
  { ssr: false },
);

export default async function Page() {
  const allOrders = await getAllOrders();
  return (
    <div className="flex flex-col w-full">
      <AddressComponentWithNoSSR />
      <OrdersTable orders={allOrders} />
    </div>
  );
}
