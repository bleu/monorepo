import { tokens } from "db/schema";
import { and, isNotNull, isNull, sql } from "drizzle-orm";
import { logIfVerbose } from "lib/logIfVerbose";
import { type Address, getContract } from "viem";

import { db } from "../../../db";
import { publicClients } from "../../../lib/chainsPublicClients";

const abi = [
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [
      {
        name: "",
        type: "uint8",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
] as const;

export const extractTokenDecimals = async () => {
  const tokensWithoutDecimals = await db
    .select({ address: tokens.address, network: tokens.networkSlug })
    .from(tokens)
    .where(
      and(
        isNull(tokens.decimals),
        isNotNull(tokens.address),
        isNotNull(tokens.networkSlug)
      )
    );

  if (tokensWithoutDecimals.length === 0) return;

  const toBeInserted = (
    await Promise.all(
      tokensWithoutDecimals.map(async ({ address, network }) => {
        if (!network || !address) return null;

        const publicClient = publicClients[network];
        const token = getContract({
          address: address as Address,
          abi,
          client: {
            public: publicClient,
          },
        });

        try {
          const response = await token.read.decimals();
          return { address, networkSlug: network, decimals: response };
        } catch (e) {
          logIfVerbose(`Error fetching decimals for ${address} on ${network}`);
          return null;
        }
      })
    )
  ).filter(Boolean) as {
    address: Address;
    networkSlug: string;
    decimals: number;
  }[];

  if (toBeInserted.length === 0) return;

  return await db
    .insert(tokens)
    .values(toBeInserted)
    .onConflictDoUpdate({
      target: [tokens.address, tokens.networkSlug],
      set: { decimals: sql`excluded.decimals` },
    });
};
