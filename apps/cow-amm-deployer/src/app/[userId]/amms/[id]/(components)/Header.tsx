"use client";

import { Card } from "@bleu/ui";
import { ArrowLeftIcon, ArrowTopRightIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Address } from "viem";

import { Button } from "#/components/Button";
import { BlockExplorerLink } from "#/components/ExplorerLink";
import { LinkComponent } from "#/components/Link";
import { StatusBadge } from "#/components/StatusBadge";
import { TokenPairLogo } from "#/components/TokenPairLogo";
import { getExplorerAddressLink } from "#/lib/cowExplorer";
import { ICowAmm, IToken } from "#/lib/fetchAmmData";
import { truncateMiddle } from "#/lib/truncateMiddle";
import { ChainId } from "#/utils/chainsPublicClients";

import { PriceInformation } from "./PriceInformation";

export function Header({
  ammData,
}: {
  ammData: ICowAmm;
  oldVersionOfAmm: boolean;
}) {
  const poolName = `${ammData.token0.symbol}/${ammData.token1.symbol}`;

  return (
    <Card.Root className="w-full overflow-visible max-w-full rounded-none bg-background">
      <Card.Header className="p-0 flex flex-col gap-y-2">
        <LinkComponent href={`/${ammData.user.id}/amms`}>
          <Button className="flex items-center gap-1 p-1" variant="ghost">
            <ArrowLeftIcon />
            CoW AMMs
          </Button>
        </LinkComponent>
        <Card.Title className="text-3xl flex flex-row gap-2 my-2 p-0 items-center">
          <TokenPairLogo
            token0={ammData.token0}
            token1={ammData.token1}
            chainId={ammData.chainId}
          />
          {poolName}
          <BlockExplorerLink
            type="token"
            label={<ArrowTopRightIcon />}
            identifier={ammData.order.owner}
            networkId={ammData.chainId as ChainId}
          />
          <StatusBadge disabled={ammData.disabled} />
        </Card.Title>
        <Card.Description className="flex mt-5 justify-between items-center text-base p-0">
          <div className="flex flex-row gap-2 items-center">
            Price Oracle: <PriceInformation cowAmm={ammData} />
          </div>
          <div className="flex flex-row gap-2 items-center">
            Orders: CoW Explorer
            <Link
              href={
                new URL(
                  getExplorerAddressLink(
                    ammData.order.chainId as ChainId,
                    ammData.order.owner as Address,
                  ),
                )
              }
              rel="noreferrer noopener"
              target="_blank"
            >
              <ArrowTopRightIcon />
            </Link>
          </div>
          <TokenLink chainId={ammData.chainId} token={ammData.token0} />
          <TokenLink chainId={ammData.chainId} token={ammData.token1} />
        </Card.Description>
      </Card.Header>
    </Card.Root>
  );
}

export function TokenLink({
  chainId,
  token,
}: {
  chainId: ChainId;
  token: IToken;
}) {
  return (
    <div className="flex flex-row gap-2 items-center">
      {token.symbol}: {truncateMiddle(token.address, 5)}
      <BlockExplorerLink
        type="token"
        label={<ArrowTopRightIcon />}
        identifier={token.address}
        networkId={chainId as ChainId}
      />
    </div>
  );
}
