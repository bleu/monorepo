import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { Address, encodeFunctionData,PublicClient } from "viem";

import { FALLBACK_STATES } from "#/app/amms/utils/type";

import { cowAmmModuleFactoryAbi } from "./abis/cowAmmModuleFactory";
import { gnosisSafeV12 } from "./abis/gnosisSafeV12";
import { signatureVerifierMuxerAbi } from "./abis/signatureVerifierMuxer";
import {
  COMPOSABLE_COW_ADDRESS,
  COW_AMM_MODULE_FACTORY_ADDRESS,
  EXTENSIBLE_FALLBACK_ADDRESS,
} from "./contracts";
import { createAmmSchema } from "./schema";

export enum TRANSACTION_TYPES {
  SET_FALLBACK_HANDLER = "SET_FALLBACK_HANDLER",
  SET_DOMAIN_VERIFIER = "SET_DOMAIN_VERIFIER",
  CREATE_COW_AMM_MODULE = "CREATE_COW_AMM_MODULE",
  ENABLE_COW_AMM_MODULE = "ENABLE_COW_AMM_MODULE",
}

export interface BaseArgs {
  type: TRANSACTION_TYPES;
}

export interface setFallbackHandlerArgs extends BaseArgs {
  safeAddress: Address;
}
export interface setDomainVerifierArgs extends BaseArgs {
  safeAddress: Address;
  domainSeparator: Address;
}
export interface createCowAmmModuleArgs extends BaseArgs {
  safeAddress: Address;
}
export interface enableCowAmmModuleArgs extends BaseArgs {
  safeAddress: Address;
  moduleAddress: Address;
}

interface ITransaction<T> {
  createRawTx(args: T): BaseTransaction;
}

class SetFallbackHandlerTx implements ITransaction<setFallbackHandlerArgs> {
  createRawTx({ safeAddress }: setFallbackHandlerArgs): BaseTransaction {
    return {
      to: safeAddress,
      value: "0",
      data: encodeFunctionData({
        abi: signatureVerifierMuxerAbi,
        functionName: "setFallbackHandler",
        args: [EXTENSIBLE_FALLBACK_ADDRESS],
      }),
    };
  }
}

class setDomainVerifierTx implements ITransaction<setDomainVerifierArgs> {
  createRawTx({
    safeAddress,
    domainSeparator,
  }: setDomainVerifierArgs): BaseTransaction {
    return {
      to: safeAddress,
      value: "0",
      data: encodeFunctionData({
        abi: signatureVerifierMuxerAbi,
        functionName: "setDomainVerifier",
        args: [domainSeparator, COMPOSABLE_COW_ADDRESS],
      }),
    };
  }
}

class createCowAmmModuleTx implements ITransaction<createCowAmmModuleArgs> {
  createRawTx({ safeAddress }: createCowAmmModuleArgs): BaseTransaction {
    return {
      to: COW_AMM_MODULE_FACTORY_ADDRESS,
      value: "0",
      data: encodeFunctionData({
        abi: cowAmmModuleFactoryAbi,
        functionName: "create",
        args: [safeAddress],
      }),
    };
  }
}

class enableCowAmmModuleTx implements ITransaction<enableCowAmmModuleArgs> {
  createRawTx({
    safeAddress,
    moduleAddress,
  }: enableCowAmmModuleArgs): BaseTransaction {
    return {
      to: safeAddress,
      value: "0",
      data: encodeFunctionData({
        abi: gnosisSafeV12,
        functionName: "enableModule",
        args: [moduleAddress],
      }),
    };
  }
}

export interface TransactionBindings {
  [TRANSACTION_TYPES.SET_FALLBACK_HANDLER]: setFallbackHandlerArgs;
  [TRANSACTION_TYPES.SET_DOMAIN_VERIFIER]: setDomainVerifierArgs;
  [TRANSACTION_TYPES.CREATE_COW_AMM_MODULE]: createCowAmmModuleArgs;
  [TRANSACTION_TYPES.ENABLE_COW_AMM_MODULE]: enableCowAmmModuleArgs;
}

export type AllTransactionArgs = TransactionBindings[keyof TransactionBindings];

const TRANSACTION_CREATORS: {
  [key in keyof TransactionBindings]: new () => ITransaction<
    TransactionBindings[key]
  >;
} = {
  [TRANSACTION_TYPES.SET_FALLBACK_HANDLER]: SetFallbackHandlerTx,
  [TRANSACTION_TYPES.SET_DOMAIN_VERIFIER]: setDomainVerifierTx,
  [TRANSACTION_TYPES.CREATE_COW_AMM_MODULE]: createCowAmmModuleTx,
  [TRANSACTION_TYPES.ENABLE_COW_AMM_MODULE]: enableCowAmmModuleTx,
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

export async function createAMMArgs(
  data: typeof createAmmSchema._type,
  publicClient: PublicClient,
) {
  const setFallbackTx = {
    type: TRANSACTION_TYPES.SET_FALLBACK_HANDLER,
    safeAddress: data.safeAddress,
  } as setFallbackHandlerArgs;
  const setDomainVerifierTx = {
    type: TRANSACTION_TYPES.SET_DOMAIN_VERIFIER,
    safeAddress: data.safeAddress,
    domainSeparator: data.domainSeparator,
  } as setDomainVerifierArgs;
  const fallbackTxs = (() => {
    switch (data.fallbackSetupState) {
      case FALLBACK_STATES.HAS_NOTHING:
        return [setFallbackTx, setDomainVerifierTx];
      case FALLBACK_STATES.HAS_EXTENSIBLE_FALLBACK:
        return [setDomainVerifierTx];
      default:
        return [];
    }
  })();

  const predictCoWAmmModuleAddress = await publicClient.readContract({
    address: COW_AMM_MODULE_FACTORY_ADDRESS,
    abi: cowAmmModuleFactoryAbi,
    functionName: "predictAddress",
    args: [data.safeAddress],
  });

  return [
    ...fallbackTxs,
    {
      type: TRANSACTION_TYPES.CREATE_COW_AMM_MODULE,
      safeAddress: data.safeAddress,
    } as createCowAmmModuleArgs,
    {
      type: TRANSACTION_TYPES.ENABLE_COW_AMM_MODULE,
      safeAddress: data.safeAddress,
      moduleAddress: predictCoWAmmModuleAddress,
    } as enableCowAmmModuleArgs,
  ];
}
