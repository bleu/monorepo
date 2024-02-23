import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { Address, encodeFunctionData } from "viem";

import { FALLBACK_STATES } from "#/app/amms/utils/type";

import { signatureVerifierMuxerAbi } from "./abis/signatureVerifierMuxer";
import {
  COMPOSABLE_COW_ADDRESS,
  EXTENSIBLE_FALLBACK_ADDRESS,
} from "./contracts";
import { createAmmSchema } from "./schema";

export enum TRANSACTION_TYPES {
  SET_FALLBACK_HANDLER = "SET_FALLBACK_HANDLER",
  SET_DOMAIN_VERIFIER = "SET_DOMAIN_VERIFIER",
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

interface ITransaction<T> {
  createRawTx(args: T): BaseTransaction;
}

class FallbackHandlerSetTx implements ITransaction<setFallbackHandlerArgs> {
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

class DomainVerifierSetTx implements ITransaction<setDomainVerifierArgs> {
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

export interface TransactionBindings {
  [TRANSACTION_TYPES.SET_FALLBACK_HANDLER]: setFallbackHandlerArgs;
  [TRANSACTION_TYPES.SET_DOMAIN_VERIFIER]: setDomainVerifierArgs;
}

export type AllTransactionArgs = TransactionBindings[keyof TransactionBindings];

const TRANSACTION_CREATORS: {
  [key in keyof TransactionBindings]: new () => ITransaction<
    TransactionBindings[key]
  >;
} = {
  [TRANSACTION_TYPES.SET_FALLBACK_HANDLER]: FallbackHandlerSetTx,
  [TRANSACTION_TYPES.SET_DOMAIN_VERIFIER]: DomainVerifierSetTx,
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

export function createAMMArgs(data: typeof createAmmSchema._type) {
  const setFallbackTx = {
    type: TRANSACTION_TYPES.SET_FALLBACK_HANDLER,
    safeAddress: data.safeAddress,
  } as setFallbackHandlerArgs;
  const DomainVerifierSetTx = {
    type: TRANSACTION_TYPES.SET_DOMAIN_VERIFIER,
    safeAddress: data.safeAddress,
    domainSeparator: data.domainSeparator,
  } as setDomainVerifierArgs;
  return (() => {
    switch (data.fallbackSetupState) {
      case FALLBACK_STATES.HAS_NOTHING:
        return [setFallbackTx, DomainVerifierSetTx];
      case FALLBACK_STATES.HAS_EXTENSIBLE_FALLBACK:
        return [DomainVerifierSetTx];
      default:
        return [];
    }
  })();
}
