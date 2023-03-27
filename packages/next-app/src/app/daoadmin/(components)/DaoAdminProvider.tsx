"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAccount, useNetwork } from "wagmi";

import { WalletNotConnectedState } from "#/components/RootLayout";
import { AdminToolsProvider } from "#/contexts/AdminToolsContext";

import { Sidebar } from "./Sidebar";

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
              <div className="h-full w-full">
                <Sidebar />
              </div>
            </div>
            <div className="p-5">{children}</div>
          </div>
        </AdminToolsProvider>
      ) : (
        <WalletNotConnectedState />
      )}
    </>
  );
}
