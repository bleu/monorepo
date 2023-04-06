"use client";

import { useNetwork } from "wagmi";

export default function Page() {
  const { chain } = useNetwork();

  return <div className="h-full flex-1 text-white">{chain?.name}</div>;
}
