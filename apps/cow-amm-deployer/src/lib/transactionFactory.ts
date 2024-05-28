import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { Address, encodeFunctionData, erc20Abi, parseUnits } from "viem";

import { ChainId } from "#/utils/chainsPublicClients";

import { ConstantProductFactoryABI } from "./abis/ConstantProductFactory";
import { cowAmmModuleAbi } from "./abis/cowAmmModule";
import { BLEU_APP_DATA } from "./constants";
import { COW_CONSTANT_PRODUCT_FACTORY } from "./contracts";
import {
  encodePriceOracleData,
  getPriceOracleAddress,
  IEncodePriceOracleData,
  IGetPriceOracleAddress,
} from "./encodePriceOracleData";
import { ammFormSchema } from "./schema";

export enum TRANSACTION_TYPES {
  ERC20_APPROVE = "ERC20_APPROVE",
  CREATE_COW_AMM = "CREATE_COW_AMM",
  EDIT_COW_AMM = "EDIT_COW_AMM",
  STOP_COW_AMM = "STOP_COW_AMM",
  WITHDRAW = "WITHDRAW_COW_AMM",
}

export interface BaseArgs {
  type: TRANSACTION_TYPES;
}

export interface withdrawCowAMMargs extends BaseArgs {
  type: TRANSACTION_TYPES.WITHDRAW;
  amm: Address;
  amount0: bigint;
  amount1: bigint;
  chainId: ChainId;
}

export interface stopCowAmmArgs extends BaseArgs {
  type: TRANSACTION_TYPES.STOP_COW_AMM;
  chainId: ChainId;
}

export interface createCowAmmArgs extends BaseArgs {
  type: TRANSACTION_TYPES.CREATE_COW_AMM;
  token0: Address;
  token1: Address;
  amount0: bigint;
  amount1: bigint;
  token0Decimals: number;
  minTradedToken0: number;
  priceOracleAddress: Address;
  appData: `0x${string}`;
  priceOracleData: `0x${string}`;
  chainId: ChainId;
}

export interface editCowAmmArgs extends Omit<createCowAmmArgs, "type"> {
  type: TRANSACTION_TYPES.EDIT_COW_AMM;
}

interface ITransaction<T> {
  createRawTx(args: T): BaseTransaction;
}

export interface ERC20ApproveArgs extends BaseArgs {
  type: TRANSACTION_TYPES.ERC20_APPROVE;
  tokenAddress: Address;
  spender: Address;
  amount: bigint;
}

class CoWAMMWithdrawRawTx implements ITransaction<withdrawCowAMMargs> {
  createRawTx({
    amm,
    amount0,
    amount1,
    chainId,
  }: withdrawCowAMMargs): BaseTransaction {
    return {
      to: COW_CONSTANT_PRODUCT_FACTORY[chainId],
      value: "0",
      data: encodeFunctionData({
        abi: ConstantProductFactoryABI,
        functionName: "withdraw",
        args: [amm, amount0, amount1],
      }),
    };
  }
}
class ERC20ApproveRawTx implements ITransaction<ERC20ApproveArgs> {
  createRawTx({
    tokenAddress,
    spender,
    amount,
  }: ERC20ApproveArgs): BaseTransaction {
    return {
      to: tokenAddress,
      value: "0",
      data: encodeFunctionData({
        abi: erc20Abi,
        functionName: "approve",
        args: [spender, amount],
      }),
    };
  }
}

class CowAmmCreateTx implements ITransaction<createCowAmmArgs> {
  createRawTx({
    token0,
    amount0,
    token1,
    amount1,
    token0Decimals,
    minTradedToken0,
    priceOracleAddress,
    priceOracleData,
    appData,
    chainId,
  }: createCowAmmArgs): BaseTransaction {
    return {
      to: COW_CONSTANT_PRODUCT_FACTORY[chainId],
      value: "0",
      data: encodeFunctionData({
        abi: ConstantProductFactoryABI,
        functionName: "create",
        args: [
          token0,
          amount0,
          token1,
          amount1,
          parseUnits(String(minTradedToken0), token0Decimals),
          priceOracleAddress,
          priceOracleData,
          appData,
        ],
      }),
    };
  }
}

class CowAmmEditTx implements ITransaction<editCowAmmArgs> {
  createRawTx({
    token0,
    token1,
    token0Decimals,
    minTradedToken0,
    priceOracleAddress,
    priceOracleData,
    appData,
    chainId,
  }: editCowAmmArgs): BaseTransaction {
    return {
      to: COW_CONSTANT_PRODUCT_FACTORY[chainId],
      value: "0",
      data: encodeFunctionData({
        abi: cowAmmModuleAbi,
        functionName: "replaceAmm",
        args: [
          token0,
          token1,
          parseUnits(String(minTradedToken0), token0Decimals),
          priceOracleAddress,
          priceOracleData,
          appData,
        ],
      }),
    };
  }
}

class CowAmmStopTx implements ITransaction<stopCowAmmArgs> {
  createRawTx({ chainId }: stopCowAmmArgs): BaseTransaction {
    return {
      to: COW_CONSTANT_PRODUCT_FACTORY[chainId],
      value: "0",
      data: encodeFunctionData({
        abi: cowAmmModuleAbi,
        functionName: "closeAmm",
      }),
    };
  }
}
export interface TransactionBindings {
  [TRANSACTION_TYPES.ERC20_APPROVE]: ERC20ApproveArgs;
  [TRANSACTION_TYPES.CREATE_COW_AMM]: createCowAmmArgs;
  [TRANSACTION_TYPES.STOP_COW_AMM]: stopCowAmmArgs;
  [TRANSACTION_TYPES.EDIT_COW_AMM]: editCowAmmArgs;
  [TRANSACTION_TYPES.WITHDRAW]: withdrawCowAMMargs;
}

export type AllTransactionArgs = TransactionBindings[keyof TransactionBindings];

const TRANSACTION_CREATORS: {
  [key in keyof TransactionBindings]: new () => ITransaction<
    TransactionBindings[key]
  >;
} = {
  [TRANSACTION_TYPES.ERC20_APPROVE]: ERC20ApproveRawTx,
  [TRANSACTION_TYPES.CREATE_COW_AMM]: CowAmmCreateTx,
  [TRANSACTION_TYPES.STOP_COW_AMM]: CowAmmStopTx,
  [TRANSACTION_TYPES.EDIT_COW_AMM]: CowAmmEditTx,
  [TRANSACTION_TYPES.WITHDRAW]: CoWAMMWithdrawRawTx,
};

export class TransactionFactory {
  static createRawTx<T extends TRANSACTION_TYPES>(
    type: T,
    args: TransactionBindings[T]
  ): BaseTransaction {
    const TransactionCreator = TRANSACTION_CREATORS[type];
    const txCreator = new TransactionCreator();
    return txCreator.createRawTx(args);
  }
}

export function buildTxAMMArgs({
  data,
  transactionType,
}: {
  data: typeof ammFormSchema._type;
  transactionType:
    | TRANSACTION_TYPES.CREATE_COW_AMM
    | TRANSACTION_TYPES.EDIT_COW_AMM;
}): AllTransactionArgs[] {
  const priceOracleData = encodePriceOracleData(data as IEncodePriceOracleData);
  const priceOracleAddress = getPriceOracleAddress(
    data as IGetPriceOracleAddress
  );

  return [
    {
      type: TRANSACTION_TYPES.ERC20_APPROVE,
      tokenAddress: data.token0.address as Address,
      spender: COW_CONSTANT_PRODUCT_FACTORY[data.chainId as ChainId],
      amount: parseUnits(String(data.amount0), data.token0.decimals),
    },
    {
      type: TRANSACTION_TYPES.ERC20_APPROVE,
      tokenAddress: data.token1.address as Address,
      spender: COW_CONSTANT_PRODUCT_FACTORY[data.chainId as ChainId],
      amount: parseUnits(String(data.amount1), data.token1.decimals),
    },
    {
      type: transactionType,
      token0: data.token0.address as Address,
      token1: data.token1.address as Address,
      amount0: parseUnits(String(data.amount0), data.token0.decimals),
      amount1: parseUnits(String(data.amount1), data.token1.decimals),
      token0Decimals: data.token0.decimals,
      minTradedToken0: data.minTradedToken0,
      priceOracleAddress,
      priceOracleData,
      appData: BLEU_APP_DATA,
      chainId: data.chainId as ChainId,
    } as const,
  ];
}
