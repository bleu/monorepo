import { Address } from "viem";
import { composableCowAbi } from "../abis/ComposableCow";
import { erc20Abi } from "../abis/erc20";
import { contextType } from "./types";

export function callERC20Contract<T>(
  address: `0x${string}`,
  functionName: "symbol" | "decimals" | "name",
  context: contextType
): Promise<T> {
  return context.client.readContract({
    abi: erc20Abi,
    address,
    functionName,
  }) as Promise<T>;
}

export function getErc20Data(address: `0x${string}`, context: contextType) {
  return Promise.all([
    callERC20Contract<string>(address, "symbol", context).catch(() => ""),
    callERC20Contract<number>(address, "decimals", context).catch(() => 0),
    callERC20Contract<string>(address, "name", context).catch(() => ""),
  ]);
}

export function getHash({
  handler,
  salt,
  staticInput,
  context,
}: {
  handler: `0x${string}`;
  salt: `0x${string}`;
  staticInput: `0x${string}`;
  context: contextType;
}) {
  return context.client.readContract({
    abi: composableCowAbi,
    address: context.contracts.composable.address,
    functionName: "hash",
    args: [{ handler, salt, staticInput }],
  });
}

export async function getToken(address: `0x${string}`, context: contextType) {
  const tokenId = `${address}-${context.network.chainId}`;
  let token = await context.db.Token.findUnique({
    id: tokenId,
  });
  if (!token) {
    const [symbol, decimals, name] = await getErc20Data(address, context);
    token = await context.db.Token.create({
      id: `${address}-${context.network.chainId}`,
      data: {
        address,
        chainId: context.network.chainId,
        symbol,
        decimals,
        name,
      },
    });
  }
  return token;
}

export async function getUser(
  address: Address,
  chainId: number,
  context: contextType
) {
  const userId = `${address}-${chainId}`;
  let user = await context.db.User.findUnique({
    id: userId,
  });

  if (!user) {
    user = await context.db.User.create({
      id: userId,
      data: {
        address,
        chainId,
      },
    });
  }
  return user;
}
