import { Network } from "@bleu-balancer-tools/shared";
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
  if (operationKindType[params.operationKind] === operationKindType.withdraw)
    return <WithdrawAll />;
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-5 text-center">
      <div className="text-3xl font-bold text-white">
        You can not {params.operationKind} all of your tokens
      </div>
      <div className="text-xl font-medium text-white">
        Please return to
        <Link
          href={`/internalmanager/${params.network}`}
          className="text-amber9"
        >
          {" "}
          the home page
        </Link>
      </div>
    </div>
  );
}
