"use client";

import React from "react";

import { useManagedTransaction } from "#/hooks/tx-manager/useManagedTransaction";

interface ITransactionContext {
  managedTransaction: ReturnType<typeof useManagedTransaction>;
}

export const TransactionManagerContext =
  React.createContext<ITransactionContext>({} as ITransactionContext);

export const TransactionManagerContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const managedTransaction = useManagedTransaction();

  return (
    <TransactionManagerContext.Provider
      value={{
        managedTransaction,
      }}
    >
      {children}
    </TransactionManagerContext.Provider>
  );
};

export const useTransactionManagerContext = () =>
  React.useContext(TransactionManagerContext);
