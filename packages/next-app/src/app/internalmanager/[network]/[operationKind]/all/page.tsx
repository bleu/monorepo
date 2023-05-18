import { Network } from "@balancer-pool-metadata/shared";
import Link from "next/link";

import { operationKindType } from "#/lib/internal-balance-helper";

import { WithdrawAll } from "./withdrawAll";

export default function Page({
  params,
}: {
  params: {
    network: Network;
    operationKind: keyof typeof operationKindType;
  };
}) {
  if (operationKindType[params.operationKind] !== operationKindType.withdraw) {
    return (
      <div className="flex flex-col items-center justify-center w-full p-5 h-full text-center">
        <div className="text-3xl font-bold text-white">
          You can not {params.operationKind} all of your tokens
        </div>
        <div className="text-xl font-medium text-white">
          Please return to
          <Link href="/internalmanager" className="text-amber9">
            {" "}
            the home page
          </Link>
        </div>
      </div>
    );
  }
  return <WithdrawAll />;
}
