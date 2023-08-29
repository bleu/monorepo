"use client";

import { useState } from "react";
import { MultiSelectDropdown } from "./MultiSelectDropdown";

const AVALIABLE_TOKENS = [
  { id: 1, value: "BAL" },
  { id: 2, value: "USDC" },
  { id: 3, value: "UDST" },
  { id: 4, value: "COIL" },
  { id: 5, value: "WETH" },
];

export function TokenFilterInput() {
  const [token, setToken] = useState([]);
  const handleTokenSelect = (selectedItems) => {
    const temp = selectedItems.map((item) => item.id);
    setToken(temp.length > 0 ? temp : []);
  };

  return (
    <>
      <MultiSelectDropdown
        items={AVALIABLE_TOKENS}
        labelText="Filter by token"
        onSelectionItemsChange={handleTokenSelect}
      />
    </>
  );
}
