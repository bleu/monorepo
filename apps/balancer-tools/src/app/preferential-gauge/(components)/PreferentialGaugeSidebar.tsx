import { Address, networkFor } from "@bleu-fi/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAccount, useNetwork } from "wagmi";

import Sidebar from "#/components/Sidebar";
import { Toast, ToastContent } from "#/components/Toast";
import {
  PreferentialGaugeGql,
  usePreferentialGauge,
} from "#/contexts/PreferetialGaugeContext";
import { gauges } from "#/lib/gql";
import { refetchRequest } from "#/utils/refetchRequest";
import { truncateAddress } from "#/utils/truncate";

export function PreferentialGaugeSidebar() {
  const [querySearch, setQuerySearch] = useState("");
  const { chain } = useNetwork();
  const { address } = useAccount();
  const path = usePathname();
  const {
    notification,
    isNotifierOpen,
    setIsNotifierOpen,
    transactionUrl,
    clearNotification,
  } = usePreferentialGauge();
  const chainId = chain?.id ?? 1;
  const { data, mutate } = gauges.gql(`${chainId}`).usePreferentialGauge();

  refetchRequest({
    mutate,
    chainId: `${chainId}`,
    userAddress: address?.toLowerCase() as Address,
  });

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setQuerySearch(e.currentTarget.value);
  };

  const filteredPoolById = data?.pools.filter((item) =>
    item.poolId.toLowerCase().includes(querySearch.toLowerCase()),
  );

  useEffect(() => {
    clearNotification();
  }, [path]);

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
                href={`/preferential-gauge/${networkFor(chain?.id)}/pool/${
                  item.poolId
                }`}
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
      {notification && (
        <Toast
          content={
            <ToastContent
              title={notification.title}
              description={notification.description}
              link={transactionUrl}
            />
          }
          variant={notification.variant}
          isOpen={isNotifierOpen}
          setIsOpen={setIsNotifierOpen}
        />
      )}
    </div>
  );
}
