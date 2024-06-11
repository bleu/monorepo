"use client";
import { formatNumber } from "@bleu/ui";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
// import { graphql } from "gql.tada";
// import request from "graphql-request";
// import useSWR from "swr";
// import { mainnet, sepolia } from "viem/chains";
import { useAccount } from "wagmi";

import { TokenLogo } from "#/components/TokenLogo";
import { IToken, ITokenExtended } from "#/lib/fetchAmmData";
// import { TokenWithLogo } from "#/lib/tokenWithLogo";
import { ChainId } from "#/utils/chainsPublicClients";

import { BlockExplorerLink } from "./ExplorerLink";

// const SEARCH_TOKENS = graphql(`
//   query SearchTokens($searchQuery: String!) {
//     searchTokens(searchQuery: $searchQuery) {
//       id
//       decimals
//       name
//       chain
//       standard
//       address
//       symbol
//       project {
//         id
//         logoUrl
//         safetyLevel
//         __typename
//       }
//       __typename
//     }
//   }
// `);

// const CHAIN_TO_CHAIN_ID: { [key: string]: ChainId } = {
//   ETHEREUM: mainnet.id,
//   ETHEREUM_SEPOLIA: sepolia.id,
// };

export async function TokenInfo({
  token,
  showBalance = false,
}: {
  token: IToken | ITokenExtended;
  showBalance?: boolean;
}) {
  // const { data } = useSWR(
  //   ["tokens", token.address],
  //   () =>
  //     request("https://bff.cow.fi/proxies/tokens", SEARCH_TOKENS, {
  //       searchQuery: token.address,
  //     }),
  //   { revalidateOnFocus: false },
  // );

  // const tokens = data?.searchTokens?.map((token) => ({
  //   ...token,
  //   chainId: CHAIN_TO_CHAIN_ID[token.chain],
  // }));

  // // eslint-disable-next-line no-console
  // console.log({ tokens });
  // // const token = TokenWithLogo.fromToken(token);

  const { chainId } = useAccount();
  return (
    <div className="flex items-center gap-x-1">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-white">
          <TokenLogo
            tokenAddress={token.address}
            chainId={chainId as ChainId}
            className="rounded-full"
            alt="Token Logo"
            height={22}
            width={22}
            quality={100}
          />
        </div>
      </div>
      <div className="flex items-center space-x-1">
        <span>{token.symbol}</span>
        <BlockExplorerLink
          type="token"
          label={<ExternalLinkIcon />}
          identifier={token.address}
          networkId={chainId as ChainId}
        />
      </div>
      <div>
        {"balance" in token &&
          showBalance &&
          `(${formatNumber(token.balance, 4, "decimal", "compact", 0.001)})`}
      </div>
    </div>
  );
}
