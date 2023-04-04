"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

import WalletNotConnected from "#/components/WalletNotConnected";
import { AdminToolsProvider } from "#/contexts/AdminToolsContext";

import { DaoAdminSidebar } from "./DaoAdminSidebar";

export function DaoAdminProvider({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  const { chain } = useNetwork();
  const { push } = useRouter();

  useEffect(() => {
    if (chain) push("/daoadmin");
  }, [chain]);

  return (
    <>
      {isConnected ? (
        <AdminToolsProvider>
          <div className="flex h-full">
            <div className="h-full w-96">
              <DaoAdminSidebar />
            </div>
            <div className="p-5">{children}</div>
          </div>
        </AdminToolsProvider>
      ) : (
        <WalletNotConnected />
      )}
    </>
  );
}
