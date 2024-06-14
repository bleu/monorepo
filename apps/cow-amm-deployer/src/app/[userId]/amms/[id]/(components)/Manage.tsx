"use client";

import {
  Card,
  Separator,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@bleu/ui";

import { DepositForm } from "#/components/DepositForm";
import { WithdrawForm } from "#/components/WithdrawForm";
import { useAmmData } from "#/contexts/ammData";

import { EditAMMForm } from "./EditAMMForm";

export function Manage() {
  const { ammData, walletBalanceToken0, walletBalanceToken1 } = useAmmData();
  const oldVersionOfAmm = ammData.version !== "Standalone";

  return (
    <>
      <Card.Root className="bg-foreground text-background overflow-visible max-w-full rounded-none px-3">
        <Card.Header className="py-1 px-0">
          <Card.Title className="px-0 text-xl">Manage</Card.Title>
          <Card.Description className="px-0 text-base">
            Manage your CoW AMM
          </Card.Description>
          <Separator />
        </Card.Header>
        <Card.Content className="px-0">
          <TabsRoot defaultValue={oldVersionOfAmm ? "edit" : "deposit"}>
            <TabsList>
              <TabsTrigger
                className="rounded-none"
                value="deposit"
                disabled={oldVersionOfAmm}
              >
                Deposit
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none"
                value="withdraw"
                disabled={oldVersionOfAmm}
              >
                Withdraw
              </TabsTrigger>
              <TabsTrigger className="rounded-none" value="edit">
                Edit Parameters
              </TabsTrigger>
            </TabsList>
            <TabsContent value="deposit" className="px-1">
              <DepositForm
                ammData={ammData}
                walletBalanceToken0={walletBalanceToken0}
                walletBalanceToken1={walletBalanceToken1}
              />
            </TabsContent>
            <TabsContent value="withdraw" className="px-1">
              <WithdrawForm ammData={ammData} />
            </TabsContent>
            <TabsContent value="edit" className="px-1">
              <EditAMMForm ammData={ammData} />
            </TabsContent>
          </TabsRoot>
        </Card.Content>
      </Card.Root>
    </>
  );
}
