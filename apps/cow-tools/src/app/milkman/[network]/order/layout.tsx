import { PropsWithChildren } from "react";

import { OrderProvider } from "#/contexts/OrderContext";

export default function Layout({ children }: PropsWithChildren) {
  return <OrderProvider>{children}</OrderProvider>;
}
