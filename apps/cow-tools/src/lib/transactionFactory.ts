import { Address } from "@bleu-fi/utils";
import { BaseTransaction } from "@gnosis.pm/safe-apps-sdk";
import { erc20ABI } from "@wagmi/core";
import { encodeFunctionData } from "viem";
import { goerli } from "viem/chains";

import { milkmanAbi } from "#/lib/abis/milkman";

import {
  encodePriceCheckerData,
  PRICE_CHECKERS,
  priceCheckerInfoMapping,
} from "./priceCheckers";

// Milkman's address is the same for all chains supported chains (Gnosis, etc...)
export const MILKMAN_ADDRESS = "0x11C76AD590ABDFFCD980afEC9ad951B160F02797";

export enum TRANSACTION_TYPES {
  ERC20_APPROVE = "ERC20_APPROVE",
  MILKMAN_ORDER = "MILKMAN_ORDER",
}
export interface BaseArgs {
  type: TRANSACTION_TYPES;
}

export interface ERC20ApproveArgs extends BaseArgs {
  type: TRANSACTION_TYPES.ERC20_APPROVE;
  tokenAddress: Address;
  spender: Address;
  amount: bigint;
}

export interface MilkmanOrderArgs extends BaseArgs {
  type: TRANSACTION_TYPES.MILKMAN_ORDER;
  tokenAddressToSell: Address;
  tokenAddressToBuy: Address;
  toAddress: Address;
  amount: bigint;
  priceChecker: PRICE_CHECKERS;
  args: bigint[];
}

interface ITransaction<T> {
  createRawTx(args: T): BaseTransaction;
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
        abi: erc20ABI,
        functionName: "approve",
        args: [spender, amount],
      }),
    };
  }
}

class MilkmanOrderRawTx implements ITransaction<MilkmanOrderArgs> {
  createRawTx({
    tokenAddressToSell,
    tokenAddressToBuy,
    toAddress,
    amount,
    priceChecker,
    args,
  }: MilkmanOrderArgs): BaseTransaction {
    const priceCheckerInfo = priceCheckerInfoMapping[priceChecker];
    const priceCheckerAddress = priceCheckerInfo.addresses[goerli.id];
    const priceCheckerData = encodePriceCheckerData(priceChecker, args);
    return {
      to: MILKMAN_ADDRESS,
      value: "0",
      data: encodeFunctionData({
        abi: milkmanAbi,
        functionName: "requestSwapExactTokensForTokens",
        args: [
          amount,
          tokenAddressToSell,
          tokenAddressToBuy,
          toAddress,
          priceCheckerAddress,
          priceCheckerData,
        ],
      }),
    };
  }
}

export interface TransactionBindings {
  [TRANSACTION_TYPES.ERC20_APPROVE]: ERC20ApproveArgs;
  [TRANSACTION_TYPES.MILKMAN_ORDER]: MilkmanOrderArgs;
}

export type AllTransactionArgs = TransactionBindings[keyof TransactionBindings];

const TRANSACTION_CREATORS: {
  [key in keyof TransactionBindings]: new () => ITransaction<
    TransactionBindings[key]
  >;
} = {
  [TRANSACTION_TYPES.ERC20_APPROVE]: ERC20ApproveRawTx,
  [TRANSACTION_TYPES.MILKMAN_ORDER]: MilkmanOrderRawTx,
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
