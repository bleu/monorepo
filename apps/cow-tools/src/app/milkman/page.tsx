"use client";

import { useAccount } from "wagmi";

export default function Page() {
  const { address } = useAccount();

  return <div className="text-white">Test {address?.toLowerCase()}</div>;
}
