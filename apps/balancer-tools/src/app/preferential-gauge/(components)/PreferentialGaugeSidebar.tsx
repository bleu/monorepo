import { NetworkChainId } from "@bleu-fi/utils";
import Link from "next/link";
import { useState } from "react";

import Sidebar from "#/components/Sidebar";
import { PreferentialGaugeGql } from "#/contexts/PreferetialGaugeContext";
import { gauges } from "#/lib/gql";
import { truncateAddress } from "#/utils/truncate";

export function PreferentialGaugeSidebar() {
  const [querySearch, setQuerySearch] = useState("");
  const { data } = gauges
    .gql(`${NetworkChainId.ETHEREUM}`)
    .usePreferentialGauge();

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setQuerySearch(e.currentTarget.value);
  };

  const filteredPoolById = data?.pools.filter((item) =>
    item.poolId.toLowerCase().includes(querySearch.toLowerCase()),
  );

  return (
    <div>
      <Sidebar isFloating>
        <Sidebar.Header name="Preferential Gauges">
          <div className="flex justify-between">
            <Sidebar.InputFilter
              placeHolder="Search for a Pool"
              onChange={handleSearchChange}
            />
          </div>
        </Sidebar.Header>
        <Sidebar.Content className="flex flex-col gap-y-2">
          {filteredPoolById &&
            filteredPoolById.map((item: PreferentialGaugeGql) => (
              <Link
                key={item.poolId}
                href={`/preferential-gauge/pool/${item.poolId}`}
              >
                <Sidebar.Item isSelected={false}>
                  <p className="flex justify-start text-lg font-bold text-slate12 group-hover:text-amber10">
                    {truncateAddress(item.poolId)}
                  </p>
                </Sidebar.Item>
              </Link>
            ))}
        </Sidebar.Content>
      </Sidebar>
    </div>
  );
}
