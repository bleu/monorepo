// copied from https://github.com/cowprotocol/cowswap/blob/d2dd0b6aa835904e4fbe191ef63bca586a222c60/apps/explorer/src/components/common/BlockExplorerLink/BlockExplorerLink.tsx

import Image from "next/image";
import Link from "next/link";
import React, { ReactElement } from "react";

import { BlockExplorerLinkType, getBlockExplorerUrl } from "#/lib/addressUtils";
import { CHAIN_INFO } from "#/lib/chainInfo";
import { truncateMiddle } from "#/lib/truncateMiddle";
import { ChainId } from "#/utils/chainsPublicClients";

export interface Props {
  /**
   * type of BlockExplorerLink
   */
  type: BlockExplorerLinkType;
  /**
   * address or transaction or other hash
   */
  identifier: string | undefined;
  /**
   * network number | chain id
   */
  networkId?: ChainId;
  /**
   * label to replace textContent generated from identifier
   */
  label?: string | ReactElement | void;

  /**
   * Use the URL as a label
   */
  useUrlAsLabel?: boolean;
  /**
   * className to pass on to <a/>
   */
  className?: string; // to allow subclassing styles with styled-components
  /**
   * to show explorer logo
   */
  showLogo?: boolean;
  /**
   * to hide label
   */
  hideLabel?: boolean;
}

/**
 * Dumb BlockExplorerLink, a pure UI component
 *
 * Does not make any assumptions regarding the network.
 * Expects all data as input. Does not use any hooks internally.
 */
export const BlockExplorerLink: React.FC<Props> = (props: Props) => {
  const {
    type,
    identifier,
    label: labelProp,
    useUrlAsLabel = false,
    className,
    networkId,
    hideLabel = false,
    showLogo = false,
  } = props;

  if (!networkId || !identifier) {
    return null;
  }

  const url = getBlockExplorerUrl(networkId, type, identifier);
  const label =
    labelProp || (useUrlAsLabel && url) || truncateMiddle(identifier);

  return (
    <Link
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      <>
        {hideLabel ? "" : <span>{label}</span>}
        {showLogo && (
          <Image
            title={`Open it on ${CHAIN_INFO[networkId].explorerTitle}`}
            src="/assets/etherscan-logo.svg"
            alt={CHAIN_INFO[networkId].explorerTitle}
            width={16}
            height={16}
          />
        )}
      </>
    </Link>
  );
};
