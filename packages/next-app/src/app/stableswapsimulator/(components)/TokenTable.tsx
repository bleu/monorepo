"use client";

import {
  MinusCircledIcon,
  Pencil1Icon,
  PlusCircledIcon,
} from "@radix-ui/react-icons";
import { createContext, useContext } from "react";

import { Dialog } from "#/components/Dialog";
import Table from "#/components/Table";
import { Tooltip } from "#/components/Tooltip";
import { TokensData, useStableSwap } from "#/contexts/StableSwapContext";

import TokenForm from "./TokenForm";

const customPadding = "py-4 px-1";

const TokenTableContext = createContext(
  {} as {
    variant: boolean;
  }
);

export function useTokenTableContext() {
  const context = useContext(TokenTableContext);
  return context;
}

export function TokenTable({
  variant = false,
  minTokens = 0,
}: {
  variant?: boolean;
  minTokens?: number;
}) {
  const { baselineData } = useStableSwap();
  let tableData = baselineData;
  if (variant) {
    const { variantData } = useStableSwap();
    tableData = variantData;
  }

  const aboveOrEqualLimit = tableData?.tokens?.length >= 8;
  return (
    <div className="h-full flex-1 flex w-full justify-center text-white">
      <Table>
        <TokenTableContext.Provider value={{ variant }}>
          <Table.HeaderRow>
            <Table.HeaderCell padding={customPadding}>
              <span className="sr-only">Edit</span>
            </Table.HeaderCell>
            <Table.HeaderCell padding={customPadding}>Symbol</Table.HeaderCell>
            <Table.HeaderCell padding={customPadding}>Balance</Table.HeaderCell>
            <Table.HeaderCell padding={customPadding}>Rate</Table.HeaderCell>
            <Table.HeaderCell padding={customPadding}>
              {aboveOrEqualLimit && (
                <Tooltip content="Balancer pools can't have more than 8 tokens">
                  <button type="button" className="flex items-center" disabled>
                    <PlusCircledIcon
                      width={20}
                      height={20}
                      className="text-slate9"
                    />
                  </button>
                </Tooltip>
              )}
              {!aboveOrEqualLimit && (
                <ButtonToOpenTokenForm
                  icon={
                    <PlusCircledIcon
                      width={22}
                      height={22}
                      className="text-green9 hover:text-green11"
                    />
                  }
                />
              )}
            </Table.HeaderCell>
          </Table.HeaderRow>
          <Table.Body>
            {tableData?.tokens?.map((token) => (
              <TableRow
                token={token}
                minTokens={minTokens}
                key={token.symbol}
              />
            ))}
          </Table.Body>
        </TokenTableContext.Provider>
      </Table>
    </div>
  );
}

function ButtonToOpenTokenForm({
  icon,
  symbolToEdit,
}: React.PropsWithChildren<{
  icon: React.ReactElement;
  symbolToEdit?: string;
}>) {
  return (
    <Dialog
      title="Add token parameters"
      content={<TokenForm symbolToEdit={symbolToEdit} />}
    >
      <button type="button" className="flex items-center">
        {icon}
      </button>
    </Dialog>
  );
}

function TableRow({
  token,
  minTokens,
}: {
  token: TokensData;
  minTokens: number;
}) {
  const { setBaselineData, baselineData, setVariantData, variantData } =
    useStableSwap();

  const deleteToken = (symbol?: string) => {
    setBaselineData({
      ...baselineData,
      tokens: baselineData.tokens.filter((token) => token.symbol !== symbol),
    });
    setVariantData({
      ...variantData,
      tokens: variantData.tokens.filter((token) => token.symbol !== symbol),
    });
  };

  const belowOrEqualLimit = baselineData?.tokens?.length <= minTokens;

  return (
    <Table.BodyRow key={token.symbol}>
      <Table.BodyCell padding={customPadding}>
        <ButtonToOpenTokenForm
          icon={
            <Pencil1Icon
              width={19}
              height={19}
              className="text-amber9 hover:text-amber11"
            />
          }
          symbolToEdit={token.symbol}
        />
      </Table.BodyCell>
      <Table.BodyCell padding={customPadding}>{token.symbol}</Table.BodyCell>
      <Table.BodyCell padding={customPadding}>
        {token.balance?.toFixed()}
      </Table.BodyCell>
      <Table.BodyCell padding={customPadding}>
        {token.rate?.toPrecision(2)}
      </Table.BodyCell>
      <Table.BodyCell padding={customPadding}>
        {belowOrEqualLimit && (
          <Tooltip
            content={`The simulation needs at least ${minTokens} tokens`}
          >
            <button type="button" className="flex items-center" disabled>
              <MinusCircledIcon
                width={20}
                height={20}
                className="text-slate9"
              />
            </button>
          </Tooltip>
        )}
        {!belowOrEqualLimit && (
          <button
            type="button"
            className="flex items-center"
            onClick={() => deleteToken(token?.symbol)}
          >
            <MinusCircledIcon
              width={20}
              height={20}
              className="text-tomato9 hover:text-tomato10"
            />
          </button>
        )}
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
