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
import { usePoolSimulator } from "#/contexts/PoolSimulatorContext";
import { formatNumber } from "#/utils/formatNumber";

import { PoolTypeEnum, TokensData } from "../(types)";
import TokenForm from "./TokenForm";

const customPadding = "py-4 px-1";

// https://docs.balancer.fi/concepts/pools/more/deployments.html#current-versions
const MAX_POOL_TOKENS_MAPPER = {
  [PoolTypeEnum.MetaStable]: 5,
  [PoolTypeEnum.GyroE]: 2,
  [PoolTypeEnum.Gyro2]: 2,
  [PoolTypeEnum.Gyro3]: 3,
};

const TokenTableContext = createContext(
  {} as {
    custom: boolean;
  }
);

export function useTokenTableContext() {
  const context = useContext(TokenTableContext);
  return context;
}

export function TokenTable({
  custom = false,
  minTokens = 0,
}: {
  custom?: boolean;
  minTokens?: number;
}) {
  const { initialData } = usePoolSimulator();
  let tableData = initialData;
  let MAX_POOL_TOKENS = MAX_POOL_TOKENS_MAPPER[initialData.poolType];

  if (custom) {
    const { customData } = usePoolSimulator();
    tableData = customData;
    MAX_POOL_TOKENS = MAX_POOL_TOKENS_MAPPER[customData.poolType];
  }

  const aboveOrEqualLimit = tableData?.tokens?.length >= MAX_POOL_TOKENS;
  return (
    <div className="flex w-full flex-1 justify-center text-white">
      <Table classNames="max-h-[220px] overflow-y-auto">
        <TokenTableContext.Provider value={{ custom }}>
          <Table.HeaderRow>
            <Table.HeaderCell padding={customPadding}>
              <span className="sr-only">Edit</span>
            </Table.HeaderCell>
            <Table.HeaderCell padding={customPadding}>Symbol</Table.HeaderCell>
            <Table.HeaderCell padding={customPadding}>Balance</Table.HeaderCell>
            <Table.HeaderCell padding={customPadding}>Rate</Table.HeaderCell>
            <Table.HeaderCell padding={customPadding}>
              {aboveOrEqualLimit && (
                <Tooltip
                  content={`This pool type can't have more than ${MAX_POOL_TOKENS} tokens.`}
                >
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
  const { setInitialData, initialData, setCustomData, customData } =
    usePoolSimulator();

  const deleteToken = (symbol?: string) => {
    setInitialData({
      ...initialData,
      tokens: initialData.tokens.filter((token) => token.symbol !== symbol),
    });
    setCustomData({
      ...customData,
      tokens: customData.tokens.filter((token) => token.symbol !== symbol),
    });
  };

  const belowOrEqualLimit = initialData?.tokens?.length <= minTokens;

  return (
    <Table.BodyRow key={token.symbol}>
      <Table.BodyCell padding={customPadding}>
        <Tooltip
          content={`If you edit the token symbol it will edit from the initial and custom data.`}
        >
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
        </Tooltip>
      </Table.BodyCell>
      <Table.BodyCell padding={customPadding}>{token.symbol}</Table.BodyCell>
      <Table.BodyCell padding={customPadding}>
        {formatNumber(token.balance, 3)}
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
          <Tooltip
            content={`Delete token will remove it from the initial and custom data.`}
          >
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
          </Tooltip>
        )}
      </Table.BodyCell>
    </Table.BodyRow>
  );
}
