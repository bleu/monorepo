"use client";

import { Card } from "@bleu/ui";
import {
  ArrowLeftIcon,
  ArrowTopRightIcon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { Address } from "viem";

import { Button } from "#/components/Button";
import { BlockExplorerLink } from "#/components/ExplorerLink";
import { LinkComponent } from "#/components/Link";
import { StatusBadge } from "#/components/StatusBadge";
import { TokenInfo } from "#/components/TokenInfo";
import { TokenPairLogo } from "#/components/TokenPairLogo";
import { getExplorerAddressLink } from "#/lib/cowExplorer";
import { ICowAmm } from "#/lib/fetchAmmData";
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
            Back to AMMs table
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
            label={<ExternalLinkIcon />}
            identifier={ammData.order.owner}
            networkId={ammData.chainId as ChainId}
          />
        </Card.Title>
        <Card.Description className="flex mt-5 justify-between items-center text-base p-0">
          <div className="flex flex-row gap-2">
            Status: <StatusBadge disabled={ammData.disabled} />
          </div>
          <div className="flex flex-row gap-2">
            Price Oracle: <PriceInformation cowAmm={ammData} />
          </div>
          <Link
            className="hover:underline inline-flex items-center gap-1 text-sm"
            href={
              new URL(
                getExplorerAddressLink(
                  ammData.order.chainId as ChainId,
                  ammData.order.owner as Address
                )
              )
            }
            rel="noreferrer noopener"
            target="_blank"
          >
            Orders History
            <ArrowTopRightIcon />
          </Link>
          <div className="flex flex-row gap-2">
            Tokens: <TokenInfo token={ammData.token0} />
            <TokenInfo token={ammData.token1} />
          </div>
        </Card.Description>
      </Card.Header>
    </Card.Root>
  );
}
