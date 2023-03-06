import { Stack } from "@chakra-ui/react";
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
    <>
      <Header />
      <Stack h="100%" w="100%" background="gray.900">
        <Sidebar />
      </Stack>
    </>
  ) : (
    <Hero />
  );
}

export default Page;
