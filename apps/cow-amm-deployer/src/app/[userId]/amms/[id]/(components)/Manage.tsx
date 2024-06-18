"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Separator,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@bleu/ui";

import { DepositForm } from "#/components/DepositForm";
import { WithdrawForm } from "#/components/WithdrawForm";
import { useAmmData } from "#/contexts/ammDataContext";

import { EditAMMForm } from "./EditAMMForm";

export function Manage() {
  const { ammData, walletBalanceToken0, walletBalanceToken1, isAmmUpdating } =
    useAmmData();
  const oldVersionOfAmm = ammData.version !== "Standalone";

  return (
    <>
      <Card className="bg-foreground text-background overflow-visible max-w-full rounded-none px-3">
        <CardHeader className="py-1 px-0">
          <CardTitle className="px-0 text-xl">Manage</CardTitle>
          <CardDescription className="px-0 text-base">
            Manage your CoW AMM
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent className="px-0">
          <TabsRoot defaultValue={oldVersionOfAmm ? "edit" : "deposit"}>
            <TabsList>
              <TabsTrigger
                className="rounded-none"
                value="deposit"
                disabled={oldVersionOfAmm || isAmmUpdating}
              >
                Deposit
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none"
                value="withdraw"
                disabled={oldVersionOfAmm || isAmmUpdating}
              >
                Withdraw
              </TabsTrigger>
              <TabsTrigger
                className="rounded-none"
                value="edit"
                disabled={isAmmUpdating}
              >
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
        </CardContent>
      </Card>
    </>
  );
}
