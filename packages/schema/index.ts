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

export const getInternalBalanceSchema = (totalBalance: number) => {
  const InternalBalanceSchema = z.object({
    tokenAddress: z.string().min(1),
    amount: z
      .number({
        //if input is empty NaN is returned, which is not considered a number
        invalid_type_error: "Amount is required",
      })
      .gt(0, { message: "Amount must be greater than 0" })
      .lte(totalBalance, { message: "Insufficient balance" }),
    receiverAddress: z
      .string()
      .min(1)
      .regex(/0x[a-fA-F0-9]{40}/, { message: "Invalid address" }),
  });
  return InternalBalanceSchema;
};

// export const jsonSchema = zodToJsonSchema(
//   PoolMetadataSchema,
//   "PoolMetadataSchema"
// );

// const identifier = "PoolMetadataSchema";
// export const { node } = zodToTs(PoolMetadataSchema, identifier);
// export const typeAlias = createTypeAlias(node, identifier);
