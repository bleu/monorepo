import Router from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import { Header, Hero, Sidebar } from "../components";

function Page() {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    localStorage.setItem("networkId", chain?.id ? String(chain.id) : "1");
    if (mounted && chain) {
      Router.reload();
    }
  }, [chain]);

  useEffect(() => setMounted(true), []);

  return isConnected ? (
    <div className="h-full w-full bg-gray-900">
      <Header />
      <div className="flex h-full">
        <div className="h-full w-96">
          <div className="h-full w-full">
            <Sidebar />
          </div>
        </div>
        <div className="h-full flex-1 py-5 text-white">
          Metadata Attributes {/* <MetadataAttribute /> */}
        </div>
      </div>
    </div>
  ) : (
    <Hero />
  );
}

export default Page;
