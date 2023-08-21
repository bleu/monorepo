import { Network } from "@bleu-balancer-tools/utils";
import { isArray } from "lodash";
import { useParams, useRouter } from "next/navigation";

import { Select, SelectItem } from "#/components/Select";

const ALL_NETWORKS = [Network.Ethereum, Network.Polygon];

export function NetworkSelector() {
  const router = useRouter();
  const { network } = useParams();
  const chain = isArray(network) ? network[0] : network;
  return (
    <Select
      value={chain ?? Network.Ethereum}
      onValueChange={(value) => {
        router.push(`/apr/${value}/round/current`);
      }}
      className="w-1/3"
    >
      <div className="p-1">
        <span className="text-sm">Network selection:</span>
        <hr className="my-2" />
        {ALL_NETWORKS.map((network) => (
          <SelectItem key={network} value={network}>
            {network}
          </SelectItem>
        ))}
      </div>
    </Select>
  );
}
