import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { Address, encodeFunctionData, erc20Abi, parseUnits } from "viem";
import { z } from "zod";

import { ChainId } from "#/utils/chainsPublicClients";

import { composableCowAbi } from "./abis/composableCow";
import { ConstantProductFactoryABI } from "./abis/ConstantProductFactory";
import { cowAmmModuleAbi } from "./abis/cowAmmModule";
import { BLEU_APP_DATA } from "./constants";
import {
  COMPOSABLE_COW_ADDRESS,
  COW_CONSTANT_PRODUCT_FACTORY,
} from "./contracts";
import { ICowAmm } from "./fetchAmmData";
import { ammEditSchema, ammFormSchema } from "./schema";
import { fetchWalletTokenBalance } from "./tokenUtils";

export enum TRANSACTION_TYPES {
  ERC20_APPROVE = "ERC20_APPROVE",
  CREATE_COW_AMM = "CREATE_COW_AMM",
  EDIT_COW_AMM = "EDIT_COW_AMM",
  STOP_COW_AMM_MODULE_VERSION = "STOP_COW_AMM_MODULE_VERSION",
  DISABLE_COW_AMM = "DISABLE_COW_AMM",
  WITHDRAW_COW_AMM = "WITHDRAW_COW_AMM",
}

export interface BaseArgs {
  type: TRANSACTION_TYPES;
}

export interface WithdrawCoWAMMArgs extends BaseArgs {
  type: TRANSACTION_TYPES.WITHDRAW_COW_AMM;
  amm: Address;
  amount0: bigint;
  amount1: bigint;
  chainId: ChainId;
}

export interface DisableCoWAMMArgs extends BaseArgs {
  type: TRANSACTION_TYPES.DISABLE_COW_AMM;
  chainId: ChainId;
  amm: Address;
  hash: `0x${string}`;
  version: "Standalone" | "SafeModule";
}

export interface StopCoWAMMModuleVersionArgs extends BaseArgs {
  type: TRANSACTION_TYPES.STOP_COW_AMM_MODULE_VERSION;
  chainId: ChainId;
}

export interface CreateCoWAMMArgs extends BaseArgs {
  type: TRANSACTION_TYPES.CREATE_COW_AMM;
  token0: Address;
  token1: Address;
  amount0: bigint;
  amount1: bigint;
  minTradedToken0: bigint;
  priceOracleAddress: Address;
  appData: `0x${string}`;
  priceOracleData: `0x${string}`;
  chainId: ChainId;
}

export interface EditCoWAMMArgs extends BaseArgs {
  type: TRANSACTION_TYPES.EDIT_COW_AMM;
  minTradedToken0: bigint;
  priceOracleAddress: Address;
  priceOracleData: `0x${string}`;
  chainId: ChainId;
  amm: Address;
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

class CoWAMMDisableRawTx implements ITransaction<DisableCoWAMMArgs> {
  createRawTx({
    amm,
    chainId,
    version,
    hash,
  }: DisableCoWAMMArgs): BaseTransaction {
    if (version === "Standalone") {
      return {
        to: COW_CONSTANT_PRODUCT_FACTORY[chainId],
        value: "0",
        data: encodeFunctionData({
          abi: ConstantProductFactoryABI,
          functionName: "disableTrading",
          args: [amm],
        }),
      };
    }
    return {
      to: COMPOSABLE_COW_ADDRESS,
      value: "0",
      data: encodeFunctionData({
        abi: composableCowAbi,
        functionName: "remove",
        args: [hash],
      }),
    };
  }
}

class CoWAMMWithdrawRawTx implements ITransaction<WithdrawCoWAMMArgs> {
  createRawTx({
    amm,
    amount0,
    amount1,
    chainId,
  }: WithdrawCoWAMMArgs): BaseTransaction {
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

class CoWAMMCreateTx implements ITransaction<CreateCoWAMMArgs> {
  createRawTx({
    token0,
    amount0,
    token1,
    amount1,
    minTradedToken0,
    priceOracleAddress,
    priceOracleData,
    appData,
    chainId,
  }: CreateCoWAMMArgs): BaseTransaction {
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
          minTradedToken0,
          priceOracleAddress,
          priceOracleData,
          appData,
        ],
      }),
    };
  }
}

class CoWAMMEditTx implements ITransaction<EditCoWAMMArgs> {
  createRawTx({
    amm,
    minTradedToken0,
    priceOracleAddress,
    priceOracleData,
    chainId,
  }: EditCoWAMMArgs): BaseTransaction {
    return {
      to: COW_CONSTANT_PRODUCT_FACTORY[chainId],
      value: "0",
      data: encodeFunctionData({
        abi: ConstantProductFactoryABI,
        functionName: "updateParameters",
        args: [
          amm,
          minTradedToken0,
          priceOracleAddress,
          priceOracleData,
          BLEU_APP_DATA,
        ],
      }),
    };
  }
}

class CoWAMMModuleVersionStopTx
  implements ITransaction<StopCoWAMMModuleVersionArgs>
{
  createRawTx({ chainId }: StopCoWAMMModuleVersionArgs): BaseTransaction {
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
  [TRANSACTION_TYPES.CREATE_COW_AMM]: CreateCoWAMMArgs;
  [TRANSACTION_TYPES.STOP_COW_AMM_MODULE_VERSION]: StopCoWAMMModuleVersionArgs;
  [TRANSACTION_TYPES.EDIT_COW_AMM]: EditCoWAMMArgs;
  [TRANSACTION_TYPES.WITHDRAW_COW_AMM]: WithdrawCoWAMMArgs;
  [TRANSACTION_TYPES.DISABLE_COW_AMM]: DisableCoWAMMArgs;
}

export type AllTransactionArgs = TransactionBindings[keyof TransactionBindings];

const TRANSACTION_CREATORS: {
  [key in keyof TransactionBindings]: new () => ITransaction<
    TransactionBindings[key]
  >;
} = {
  [TRANSACTION_TYPES.ERC20_APPROVE]: ERC20ApproveRawTx,
  [TRANSACTION_TYPES.CREATE_COW_AMM]: CoWAMMCreateTx,
  [TRANSACTION_TYPES.STOP_COW_AMM_MODULE_VERSION]: CoWAMMModuleVersionStopTx,
  [TRANSACTION_TYPES.EDIT_COW_AMM]: CoWAMMEditTx,
  [TRANSACTION_TYPES.WITHDRAW_COW_AMM]: CoWAMMWithdrawRawTx,
  [TRANSACTION_TYPES.DISABLE_COW_AMM]: CoWAMMDisableRawTx,
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

export function buildTxCreateAMMArgs({
  data,
}: {
  data: z.output<typeof ammFormSchema>;
}): AllTransactionArgs[] {
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
      type: TRANSACTION_TYPES.CREATE_COW_AMM,
      token0: data.token0.address as Address,
      token1: data.token1.address as Address,
      amount0: parseUnits(String(data.amount0), data.token0.decimals),
      amount1: parseUnits(String(data.amount1), data.token1.decimals),
      minTradedToken0: parseUnits(
        String(data.minTradedToken0),
        data.token0.decimals
      ),
      priceOracleAddress: data.priceOracleSchema.priceOracleAddress as Address,
      priceOracleData: data.priceOracleSchema.priceOracleData as `0x${string}`,
      appData: BLEU_APP_DATA,
      chainId: data.chainId as ChainId,
    } as const,
  ];
}
export function buildTxEditAMMArgs({
  data,
  ammAddress,
}: {
  data: z.output<typeof ammEditSchema>;
  ammAddress: Address;
}): AllTransactionArgs[] {
  return [
    {
      type: TRANSACTION_TYPES.EDIT_COW_AMM,
      amm: ammAddress,
      minTradedToken0: parseUnits(
        String(data.minTradedToken0),
        data.token0.decimals
      ),
      priceOracleAddress: data.priceOracleSchema.priceOracleAddress as Address,
      priceOracleData: data.priceOracleSchema.priceOracleData as `0x${string}`,
      chainId: data.chainId as ChainId,
    } as const,
  ];
}

export async function buildMigrateToStandaloneVersionArgs({
  data,
}: {
  data: ICowAmm;
}): Promise<AllTransactionArgs[]> {
  const userAddress = data.user.address as Address;
  const chainId = data.chainId as ChainId;

  const [token0Amount, token1Amount] = await Promise.all([
    fetchWalletTokenBalance({
      token: data.token0,
      walletAddress: userAddress,
      chainId,
    }).then((balance) => parseUnits(balance, data.token0.decimals)),
    fetchWalletTokenBalance({
      token: data.token1,
      walletAddress: userAddress,
      chainId,
    }).then((balance) => parseUnits(balance, data.token1.decimals)),
  ]);

  return [
    {
      type: TRANSACTION_TYPES.DISABLE_COW_AMM,
      chainId: data.order.chainId as ChainId,
      amm: data.order.owner as Address,
      hash: data.order.hash as `0x${string}`,
      version: data.version as "Standalone" | "SafeModule",
    },
    {
      type: TRANSACTION_TYPES.ERC20_APPROVE,
      tokenAddress: data.token0.address as Address,
      spender: COW_CONSTANT_PRODUCT_FACTORY[data.chainId as ChainId],
      amount: token0Amount,
    },
    {
      type: TRANSACTION_TYPES.ERC20_APPROVE,
      tokenAddress: data.token1.address as Address,
      spender: COW_CONSTANT_PRODUCT_FACTORY[data.chainId as ChainId],
      amount: token1Amount,
    },
    {
      type: TRANSACTION_TYPES.CREATE_COW_AMM,
      token0: data.token0.address as Address,
      token1: data.token1.address as Address,
      amount0: token0Amount,
      amount1: token1Amount,
      minTradedToken0: data.minTradedToken0,
      priceOracleAddress: data.priceOracle,
      priceOracleData: data.priceOracleData,
      appData: BLEU_APP_DATA,
      chainId: data.chainId as ChainId,
    },
  ];
}
