"use client";

import { useAccount } from "wagmi";

const AddressComponent = () => {
  const { address } = useAccount();

  return <div className="text-white">Test {address}</div>;
};

export default AddressComponent;
