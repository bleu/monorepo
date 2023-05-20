import { parseFixed } from "@ethersproject/bignumber";
import { BigNumber, ethers } from "ethers";
import { z } from "zod";

export const TypenameEnum = z.enum(["text", "url", "date", "datetime-local"]);

// TODO: add a note about date/datetime values being all UTC-based
const datelike = z.union([z.number(), z.string(), z.date()]);

const baseMetadataItemSchema = z.object({
  key: z.string().min(1),
  description: z.string().min(1),
});

const metadataTextSchema = z
  .object({
    typename: z.literal(TypenameEnum.enum.text),
    value: z.string().min(1),
  })
  .merge(baseMetadataItemSchema);

const metadataUrlSchema = z
  .object({
    typename: z.literal(TypenameEnum.enum.url),
    value: z.string().url(),
  })
  .merge(baseMetadataItemSchema);

const metadataDateSchema = z
  .object({
    typename: z.literal(TypenameEnum.enum.date),
    value: datelike.pipe(
      z.coerce.string().min(1, { message: "Please pick a date" })
    ),
  })
  .merge(baseMetadataItemSchema);

const metadataDatetimeSchema = z
  .object({
    typename: z.literal(TypenameEnum.enum["datetime-local"]),
    value: datelike.pipe(z.coerce.string()),
  })
  .merge(baseMetadataItemSchema);

export const MetadataItemSchema = z.union([
  metadataTextSchema,
  metadataUrlSchema,
  metadataDateSchema,
  metadataDatetimeSchema,
]);

export const PoolMetadataSchema = z
  .array(MetadataItemSchema)
  .describe("My neat object schema");

export const getInternalBalanceSchema = ({
  totalBalance,
  userAddress,
  operationKind,
  decimals,
}: {
  totalBalance: string | BigNumber;
  userAddress: string;
  operationKind: string;
  decimals: number;
}) => {
  const InternalBalanceSchema = z.object({
    tokenAddress: z
      .string()
      .min(1)
      .refine((value) => ethers.utils.isAddress(value), {
        message: "Provided address is invalid",
      }),
    tokenAmount: z.string().transform((val, ctx) => {
      if (val === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Token amount cannot be empty",
        });
      }
      if (Number(val) <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Token amount must be greater than 0",
        });
      }
      if (typeof totalBalance === "string") {
        if (parseFixed(val, decimals).gt(parseFixed(totalBalance, decimals))) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Amount exceeds total balance",
          });
        }
      } else {
        if (parseFixed(val, decimals).gt(totalBalance)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Amount exceeds total balance",
          });
        }
      }
      return val;
    }),
    receiverAddress: z
      .string()
      .min(1)
      .refine((value) => ethers.utils.isAddress(value), {
        message: "Provided address is invalid",
      })
      .transform((val, ctx) => {
        if (
          operationKind === "transfer" &&
          val.toLowerCase() === userAddress.toLowerCase()
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Receiver address cannot be the same as sender address",
          });
        }
        return val;
      }),
  });
  return InternalBalanceSchema;
};

export const AddressSchema = z.object({
  receiverAddress: z
    .string()
    .min(1)
    .refine((value) => ethers.utils.isAddress(value), {
      message: "Provided address is invalid",
    }),
});

// export const jsonSchema = zodToJsonSchema(
//   PoolMetadataSchema,
//   "PoolMetadataSchema"
// );

// const identifier = "PoolMetadataSchema";
// export const { node } = zodToTs(PoolMetadataSchema, identifier);
// export const typeAlias = createTypeAlias(node, identifier);

export const StableSwapSimulatorInitialParametersSchema = z.object({
  swapFee: z.number().positive(),
  ampFactor: z.number().positive(),
});
