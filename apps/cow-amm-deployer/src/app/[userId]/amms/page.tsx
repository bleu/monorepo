"use client";
import { formatNumber } from "@bleu/utils/formatNumber";
import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "#/components";
import { Spinner } from "#/components/Spinner";
import Table from "#/components/Table";
import { TokenInfo } from "#/components/TokenInfo";
import {
  fetchAllStandAloneAmmsFromUser,
  ICoWAmmOverview,
} from "#/lib/fetchAmmData";

export default function Page({ params }: { params: { userId: string } }) {
  const [standaloneAmmData, setStandaloneAmmData] = useState<ICoWAmmOverview[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  async function updateStandaloneAmmData() {
    setIsLoading(true);
    const data = await fetchAllStandAloneAmmsFromUser(params.userId);
    setStandaloneAmmData(data);
    setIsLoading(false);
  }

  useEffect(() => {
    updateStandaloneAmmData();
  }, []);

  return (
    <div className="flex w-full justify-center">
      <div className="relative flex w-1/2 flex-col gap-2">
        <div className="flex justify-between">
          <div className="flex gap-1">
            <h1 className="text-2xl text-center">My CoW AMMs</h1>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary/50 hover:bg-transparent"
              onClick={updateStandaloneAmmData}
            >
              <ReloadIcon className="size-5" />
            </Button>
          </div>
          <Link href={"/new"}>
            <Button>New AMM</Button>
          </Link>
        </div>
        <Table
          color="foreground"
          shade="darkWithBorder"
          classNames="overflow-y-auto text-background"
        >
          <Table.HeaderRow>
            <Table.HeaderCell>Token pair</Table.HeaderCell>
            <Table.HeaderCell>
              <span className="sr-only">Token pair</span>
            </Table.HeaderCell>
            <Table.HeaderCell>Value</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Updated at</Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body>
            {isLoading ? (
              <Table.BodyRow>
                <Table.BodyCell
                  classNames="items-center"
                  colSpan={5}
                  padding="py-1"
                >
                  <Spinner size="md" />
                </Table.BodyCell>
              </Table.BodyRow>
            ) : standaloneAmmData.length === 0 ? (
              <Table.BodyRow>
                <Table.BodyCell colSpan={5} classNames="text-center">
                  No AMMs created yet
                </Table.BodyCell>
              </Table.BodyRow>
            ) : (
              standaloneAmmData.map((amm) => (
                <Table.BodyRow
                  key={amm.id}
                  onClick={() => {
                    router.push(`/${params.userId}/amms/${amm.id}`);
                  }}
                  classNames="hover:cursor-pointer hover:bg-foreground/50"
                >
                  <Table.BodyCell padding="px-1" classNames="text-base">
                    <TokenInfo token={amm.token0} />
                  </Table.BodyCell>
                  <Table.BodyCell padding="px-1" classNames="text-base">
                    <TokenInfo token={amm.token1} />
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <span className="text-base">
                      $ {formatNumber(amm.totalUsdValue, 2)}
                    </span>
                  </Table.BodyCell>
                  <Table.BodyCell>
                    {amm.disabled ? (
                      <span className="bg-highlight rounded-full p-2 text-base">
                        Paused
                      </span>
                    ) : (
                      <span className="bg-success rounded-full p-2 text-base">
                        Active
                      </span>
                    )}
                  </Table.BodyCell>
                  <Table.BodyCell>
                    <span className="text-base"></span>
                    {new Date(
                      (amm.order.blockTimestamp as number) * 1000
                    ).toLocaleString()}
                  </Table.BodyCell>
                </Table.BodyRow>
              ))
            )}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
}
