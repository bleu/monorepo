import { useSafeAppsSDK } from "@gnosis.pm/safe-apps-react-sdk";
import { TokenBalance } from "@gnosis.pm/safe-apps-sdk";
import { useEffect, useState } from "react";

export function useSafeBalances(): { assets: TokenBalance[]; loaded: boolean } {
  const { sdk } = useSafeAppsSDK();

  const [assets, setAssets] = useState<TokenBalance[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadBalances() {
      const balances = await sdk.safe.experimental_getBalances();

      setAssets(
        balances.items.filter(
          (item) =>
            parseInt(item.balance) > 0 && item.tokenInfo.type === "ERC20",
        ),
      );
      setLoaded(true);
    }

    loadBalances();
  }, [sdk]);

  return { assets, loaded };
}
