import { MetadataApi } from "@cowprotocol/app-data";
import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { Address, encodeFunctionData, parseUnits } from "viem";

import { ChainId, publicClientsFromIds } from "#/utils/chainsPublicClients";

import { cowAmmModuleAbi } from "./abis/cowAmmModule";
import { gnosisSafeV12 } from "./abis/gnosisSafeV12";
import { COW_AMM_MODULE_ADDRESS } from "./contracts";
import {
  encodePriceOracleData,
  getPriceOracleAddress,
  IEncodePriceOracleData,
  IGetPriceOracleAddress,
} from "./encodePriceOracleData";
import { uploadAppData } from "./orderBookApi/uploadAppData";
import { ammFormSchema } from "./schema";

export enum TRANSACTION_TYPES {
  ENABLE_COW_AMM_MODULE = "ENABLE_COW_AMM_MODULE",
  CREATE_COW_AMM = "CREATE_COW_AMM",
  EDIT_COW_AMM = "EDIT_COW_AMM",
  STOP_COW_AMM = "STOP_COW_AMM",
}

export interface BaseArgs {
  type: TRANSACTION_TYPES;
}
export interface enableCowAmmModuleArgs extends BaseArgs {
  type: TRANSACTION_TYPES.ENABLE_COW_AMM_MODULE;
  chainId: ChainId;
  safeAddress: Address;
}

export interface stopCowAmmArgs extends BaseArgs {
  type: TRANSACTION_TYPES.STOP_COW_AMM;
  chainId: ChainId;
}

export interface creteCowAmmArgs extends BaseArgs {
  type: TRANSACTION_TYPES.CREATE_COW_AMM;
  token0: Address;
  token1: Address;
  token0Decimals: number;
  minTradedToken0: number;
  priceOracleAddress: Address;
  appData: `0x${string}`;
  priceOracleData: `0x${string}`;
  chainId: ChainId;
}

export interface editCowAmmArgs extends Omit<creteCowAmmArgs, "type"> {
  type: TRANSACTION_TYPES.EDIT_COW_AMM;
}

interface ITransaction<T> {
  createRawTx(args: T): BaseTransaction;
}
class CowAmmEnableModuleTx implements ITransaction<enableCowAmmModuleArgs> {
  createRawTx({
    safeAddress,
    chainId,
  }: enableCowAmmModuleArgs): BaseTransaction {
    return {
      to: safeAddress,
      value: "0",
      data: encodeFunctionData({
        abi: gnosisSafeV12,
        functionName: "enableModule",
        args: [COW_AMM_MODULE_ADDRESS[chainId]],
      }),
    };
  }
}

class CowAmmCreateTx implements ITransaction<creteCowAmmArgs> {
  createRawTx({
    token0,
    token1,
    token0Decimals,
    minTradedToken0,
    priceOracleAddress,
    priceOracleData,
    appData,
    chainId,
  }: creteCowAmmArgs): BaseTransaction {
    return {
      to: COW_AMM_MODULE_ADDRESS[chainId],
      value: "0",
      data: encodeFunctionData({
        abi: cowAmmModuleAbi,
        functionName: "createAmm",
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
      to: COW_AMM_MODULE_ADDRESS[chainId],
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
      to: COW_AMM_MODULE_ADDRESS[chainId],
      value: "0",
      data: encodeFunctionData({
        abi: cowAmmModuleAbi,
        functionName: "closeAmm",
      }),
    };
  }
}
export interface TransactionBindings {
  [TRANSACTION_TYPES.ENABLE_COW_AMM_MODULE]: enableCowAmmModuleArgs;
  [TRANSACTION_TYPES.CREATE_COW_AMM]: creteCowAmmArgs;
  [TRANSACTION_TYPES.STOP_COW_AMM]: stopCowAmmArgs;
  [TRANSACTION_TYPES.EDIT_COW_AMM]: editCowAmmArgs;
}

export type AllTransactionArgs = TransactionBindings[keyof TransactionBindings];

const TRANSACTION_CREATORS: {
  [key in keyof TransactionBindings]: new () => ITransaction<
    TransactionBindings[key]
  >;
} = {
  [TRANSACTION_TYPES.ENABLE_COW_AMM_MODULE]: CowAmmEnableModuleTx,
  [TRANSACTION_TYPES.CREATE_COW_AMM]: CowAmmCreateTx,
  [TRANSACTION_TYPES.STOP_COW_AMM]: CowAmmStopTx,
  [TRANSACTION_TYPES.EDIT_COW_AMM]: CowAmmEditTx,
};

export class TransactionFactory {
  static createRawTx<T extends TRANSACTION_TYPES>(
    type: T,
    args: TransactionBindings[T],
  ): BaseTransaction {
    const TransactionCreator = TRANSACTION_CREATORS[type];
    const txCreator = new TransactionCreator();
    return txCreator.createRawTx(args);
  }
}

export async function buildTxAMMArgs({
  data,
  transactionType,
}: {
  data: typeof ammFormSchema._type;
  transactionType:
    | TRANSACTION_TYPES.CREATE_COW_AMM
    | TRANSACTION_TYPES.EDIT_COW_AMM;
}): Promise<AllTransactionArgs[]> {
  const publicClient = publicClientsFromIds[data.chainId as ChainId];

  const isCoWAmmModuleEnabled = await publicClient.readContract({
    address: data.safeAddress as Address,
    abi: gnosisSafeV12,
    functionName: "isModuleEnabled",
    args: [COW_AMM_MODULE_ADDRESS[data.chainId as ChainId]],
  });
  const enableCoWAmmTxs = isCoWAmmModuleEnabled
    ? []
    : [
        {
          type: TRANSACTION_TYPES.ENABLE_COW_AMM_MODULE,
          safeAddress: data.safeAddress as Address,
          chainId: data.chainId as ChainId,
        } as const,
      ];

  const metadataApi = new MetadataApi();

  const appDataDoc = await metadataApi.generateAppDataDoc({
    appCode: "CoW AMM Bleu Ui",
  });
  const { appDataHex, appDataContent } =
    await metadataApi.appDataToCid(appDataDoc);

  await uploadAppData({
    fullAppData: appDataContent,
    appDataHex,
    chainId: data.chainId as ChainId,
  });

  const priceOracleData = encodePriceOracleData(data as IEncodePriceOracleData);
  const priceOracleAddress = getPriceOracleAddress(
    data as IGetPriceOracleAddress,
  );

  return [
    ...enableCoWAmmTxs,
    {
      type: transactionType,
      token0: data.token0.address as Address,
      token1: data.token1.address as Address,
      token0Decimals: data.token0.decimals,
      minTradedToken0: data.minTradedToken0,
      priceOracleAddress,
      priceOracleData,
      appData: appDataHex as `0x${string}`,
      chainId: data.chainId as ChainId,
    } as const,
  ];
}
