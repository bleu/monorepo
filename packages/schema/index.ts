import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { createTypeAlias, zodToTs } from "zod-to-ts";

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

const metadataDatetimeSchema = z.object({
  typename: z.literal(TypenameEnum.enum["datetime-local"]),
  value: datelike.pipe(z.coerce.string()),
});

export const MetadataItemSchema = z.union([
  metadataTextSchema,
  metadataUrlSchema,
  metadataDateSchema,
  metadataDatetimeSchema,
]);

export const PoolMetadataSchema = z
  .array(MetadataItemSchema)
  .describe("My neat object schema");

export const jsonSchema = zodToJsonSchema(
  PoolMetadataSchema,
  "PoolMetadataSchema"
);

const identifier = "PoolMetadataSchema";
export const { node } = zodToTs(PoolMetadataSchema, identifier);
export const typeAlias = createTypeAlias(node, identifier);
