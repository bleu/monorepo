import dynamic from "next/dynamic";

import { OrdersTable } from "./components/OrdersTable";


const AddressComponentWithNoSSR = dynamic(
  () => import("./components/WalletAddress"),
  { ssr: false }
);


export default async function Page() {
  return (
    <div className="flex flex-col w-full">
      <AddressComponentWithNoSSR />
      <OrdersTable />
    </div>
  );
}
