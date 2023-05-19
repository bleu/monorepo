import { networkIdEnumMap } from "@balancer-pool-metadata/shared";
import { useRouter } from "next/navigation";

import { PoolAttribute } from "#/components/SearchPoolForm";
import { useNetwork } from "#/wagmi";

export default function handleGoToPool(formData: PoolAttribute) {
  const { push } = useRouter();
  const { chain } = useNetwork();

  const networkId = formData.network ?? chain?.id.toString();
  const networkName =
    networkIdEnumMap[networkId as keyof typeof networkIdEnumMap];
  push(`/metadata/${networkName}/pool/${formData.poolId}`);
}
