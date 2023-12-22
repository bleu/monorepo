"use client";
import { VeBalGetVotingListQuery } from "@bleu-fi/gql/src/balancer-api-v3/__generated__/Ethereum";
import { NetworkChainId, NetworkFromNetworkChainId } from "@bleu-fi/utils";
import { formatNumber } from "@bleu-fi/utils/formatNumber";
import { ArrowTopRightIcon } from "@radix-ui/react-icons";
import { capitalize } from "lodash";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ToastContent } from "#/app/metadata/[network]/pool/[poolId]/(components)/MetadataAttributesTable/TransactionModal";
import { ClickToCopy } from "#/components/ClickToCopy";
import { Spinner } from "#/components/Spinner";
import Table from "#/components/Table";
import { Toast } from "#/components/Toast";
import {
  gaugeItem,
  useGaugesCheckpointer,
} from "#/contexts/GaugesCheckpointerContext";
import { balancerApiV3 } from "#/lib/gql";
import { ArrElement, GetDeepProp } from "#/utils/getTypes";
import { truncateAddress } from "#/utils/truncate";
import { readBalToMint } from "#/wagmi/readBalToMint";

import { apiChainNameToNetworkNumber } from "../(utils)/chainMapping";

export function GaugesTable() {
  const { notification, setIsNotifierOpen, isNotifierOpen, transactionUrl } =
    useGaugesCheckpointer();
  const [gaugeItems, setGaugeItems] = useState<gaugeItem[]>([]);
  const [loading, setLoading] = useState(true);

  function votingListFilter(
    votingOption: ArrElement<
      GetDeepProp<VeBalGetVotingListQuery, "veBalGetVotingList">
    >,
  ) {
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return (
      !votingOption.gauge.isKilled &&
      currentTimestamp > (votingOption.gauge.addedTimestamp || 0) &&
      votingOption.chain !== "MAINNET"
    );
  }
  const { data: veBalGetVotingList } = balancerApiV3
    .gql("1")
    .useVeBalGetVotingList();

  async function updateGaugeItems(
    votingOptions: ArrElement<
      GetDeepProp<VeBalGetVotingListQuery, "veBalGetVotingList">
    >[],
  ) {
    setLoading(true);

    const votingOptionsFiltered = votingOptions.filter(votingListFilter);
    const balToMinOnEachGauge = await Promise.all(
      votingOptionsFiltered?.map(async (votingOption) => {
        return readBalToMint(votingOption);
      }),
    );
    const newGaugeItems = votingOptionsFiltered.map((votingOption, index) => {
      return {
        votingOption,
        balToMint: balToMinOnEachGauge[index],
      };
    });
    setGaugeItems(newGaugeItems);
    setLoading(false);
  }

  useEffect(() => {
    if (!veBalGetVotingList) return;
    updateGaugeItems(veBalGetVotingList?.veBalGetVotingList);
  }, [veBalGetVotingList]);

  if (loading) {
    return (
      <div className="flex w-full flex-1 justify-center text-white max-h-[520px] overflow-y-auto">
        <div className="mt-24 flex flex-col items-center justify-center">
          <Spinner />
        </div>
      </div>
    );
  }

  const gaugeItemsSortedByBalToMint = gaugeItems.sort(
    (a, b) => (b.balToMint || 0) - (a.balToMint || 0),
  );

  return (
    <div className="flex w-full flex-1 justify-center text-white max-h-[520px] overflow-y-auto">
      {!gaugeItems ||
        (gaugeItems.length === 0 && (
          <div className="mt-24 flex flex-col items-center justify-center">
            <div className="text-2xl font-semibold">
              No gauges found. Please try again later
            </div>
          </div>
        ))}
      {gaugeItems.length && (
        <Table color="blue" shade="darkWithBorder">
          <Table.HeaderRow>
            <Table.HeaderCell>Pool</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Gauge</Table.HeaderCell>
            <Table.HeaderCell>BAL to mint</Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body className="overflow-y-auto">
            {gaugeItemsSortedByBalToMint.map((gaugeItem, index) => {
              return <TableRow key={index} {...gaugeItem} />;
            })}
          </Table.Body>
        </Table>
      )}
      {notification && (
        <Toast
          content={
            <ToastContent
              title={notification.title}
              description={notification.description}
              link={transactionUrl}
            />
          }
          isOpen={isNotifierOpen}
          setIsOpen={setIsNotifierOpen}
          variant={notification.variant}
        />
      )}
    </div>
  );
}

function TableRow({ votingOption, balToMint }: gaugeItem) {
  if (votingOption.gauge.isKilled) return null;

  const chainId = apiChainNameToNetworkNumber[
    votingOption.chain
  ] as NetworkChainId;
  const chainName = NetworkFromNetworkChainId[chainId];
  const poolUrl = `https://app.balancer.fi/#/${chainName}/pool/${votingOption.id}`;

  return (
    <Table.BodyRow key={votingOption.address}>
      <Table.BodyCell>
        <div className="flex flex-row items-center gap-x-1">
          {votingOption.symbol} ({capitalize(chainName)}){" "}
          <Link href={poolUrl} target="_blank">
            <ArrowTopRightIcon className="hover:text-slate11" />
          </Link>
        </div>
      </Table.BodyCell>
      <Table.BodyCell>{votingOption.type}</Table.BodyCell>
      <Table.BodyCell>
        <div className="flex flex-row items-center gap-x-1">
          <ClickToCopy text={votingOption.gauge.address}>
            {truncateAddress(votingOption.gauge.address)}
          </ClickToCopy>
        </div>
      </Table.BodyCell>
      <Table.BodyCell>
        {typeof balToMint != "number"
          ? "Error"
          : formatNumber(balToMint, 2, "decimal", "standard", 0.01)}
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
