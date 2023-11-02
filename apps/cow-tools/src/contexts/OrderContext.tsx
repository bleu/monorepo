"use client";

import { createContext, PropsWithChildren, useContext, useState } from "react";

import { TransactionStatus } from "#/app/milkman/utils/type";

type OrderContextType = {
  transactionStatus: TransactionStatus;
  setTransactionStatus: (status: TransactionStatus) => void;
};

export const OrderContext = createContext({} as OrderContextType);

export function OrderProvider({ children }: PropsWithChildren) {
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    TransactionStatus.ORDER_OVERVIEW,
  );

  return (
    <OrderContext.Provider
      value={{
        transactionStatus,
        setTransactionStatus,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  return context;
}
