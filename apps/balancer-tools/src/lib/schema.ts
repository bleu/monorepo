import { parseFixed } from "@bleu-balancer-tools/utils";
import { isAddress } from "viem";
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
      z.coerce.string().min(1, { message: "Please pick a date" }),
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
  totalBalance: string | bigint;
  userAddress: string;
  operationKind: string;
  decimals: number;
}) => {
  const InternalBalanceSchema = z.object({
    tokenAddress: z
      .string()
      .min(1)
      .refine((value) => isAddress(value), {
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
        if (parseFixed(val, decimals) > parseFixed(totalBalance, decimals)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Amount exceeds total balance",
          });
        }
      } else {
        if (parseFixed(val, decimals) > totalBalance) {
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
      .refine((value) => isAddress(value), {
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
    .refine((value) => isAddress(value), {
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

export const getStableSwapSimulatorTokensSchema = ({
  symbolToEdit,
  existentSymbols,
}: {
  symbolToEdit?: string;
  existentSymbols?: string[];
}) => {
  const StableSwapSimulatorTokensSchema = z.object({
    symbol: z
      .string()
      .min(1)
      .refine(
        (value) => {
          if (existentSymbols) {
            if (value === symbolToEdit) {
              return true;
            }
            return !existentSymbols.includes(value);
          }
          return true;
        },
        {
          message: "Symbol already exists",
        },
      ),
    balance: z.coerce.number().positive(),
    rate: z.coerce.number().positive(),
    decimal: z.coerce.number().int().positive().max(60),
  });
  return StableSwapSimulatorTokensSchema;
};

export const BasePoolSchema = z.object({
  swapFee: z.coerce.number().min(0).max(10), //source: https://github.com/balancer/balancer-v2-monorepo/blob/c4cc3d466eaa3c1e5fa62d303208c6c4a10db48a/pkg/pool-utils/contracts/BasePool.sol#L74
});

export const BaseTokenSchema = z.object({
  symbol: z.string().min(1),
  balance: z.coerce.number().positive(),
  decimal: z.coerce.number().int().positive().max(60),
});

export const GyroEDataSchema = BasePoolSchema.extend({
  alpha: z.coerce.number().min(0), //source: https://github.com/gyrostable/concentrated-lps/blob/7e9bd3b20dd52663afca04ca743808b1d6a9521f/contracts/eclp/GyroECLPMath.sol#L47C10-L47C60
  beta: z.coerce.number().min(0), //source: https://github.com/gyrostable/concentrated-lps/blob/7e9bd3b20dd52663afca04ca743808b1d6a9521f/contracts/eclp/GyroECLPMath.sol#L47C10-L47C60
  lambda: z.number().min(1).max(1e8), //source: https://2063019688-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MU527HCtxlYaQoNazhF%2Fuploads%2Fh7LxmzxixMlcZfja8q2K%2FE-CLP%20high-precision%20calculations.pdf?alt=media&token=f4fd00a2-3cb7-4318-a8f3-ed06ecdf52dd
  c: z.coerce.number().max(1), //source : on page 8 https://2063019688-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MU527HCtxlYaQoNazhF%2Fuploads%2Fh7LxmzxixMlcZfja8q2K%2FE-CLP%20high-precision%20calculations.pdf?alt=media&token=f4fd00a2-3cb7-4318-a8f3-ed06ecdf52dd
  s: z.coerce.number().max(1), //source : on page 8 https://2063019688-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MU527HCtxlYaQoNazhF%2Fuploads%2Fh7LxmzxixMlcZfja8q2K%2FE-CLP%20high-precision%20calculations.pdf?alt=media&token=f4fd00a2-3cb7-4318-a8f3-ed06ecdf52dd
  tokens: z
    .array(
      BaseTokenSchema.extend({
        rate: z.coerce.number().positive(),
      }),
    )
    .length(2),
})
  .refine(
    (data) => {
      const k2 = Math.pow(data.s, 2) + Math.pow(data.c, 2); //calculates the squared L2 norm (Euclidean norm) of the vector formed by s and c
      return Math.abs(k2 - 1) <= 1e-15; // checks whether the squared L2 norm of the vector equals 1 within a tolerance of 1e-15.
      //It does this by subtracting 1 from k2 to get the difference, taking the absolute value of the difference to ignore the sign, and checking whether this absolute difference is less than or equal to 1e-15
      //source: https://github.com/gyrostable/concentrated-lps/blob/7e9bd3b20dd52663afca04ca743808b1d6a9521f/contracts/eclp/GyroECLPMath.sol#L51C2-L54C76
      //source 2: on page 8 https://2063019688-files.gitbook.io/~/files/v0/b/gitbook-x-prod.appspot.com/o/spaces%2F-MU527HCtxlYaQoNazhF%2Fuploads%2Fh7LxmzxixMlcZfja8q2K%2FE-CLP%20high-precision%20calculations.pdf?alt=media&token=f4fd00a2-3cb7-4318-a8f3-ed06ecdf52dd
    },
    {
      message: "The squared norm of vector [s, c] must be 1 ± 1e−15",
    },
  )
  .refine(
    (data) => {
      return data.beta > data.alpha; //source: https://github.com/gyrostable/concentrated-lps/blob/7e9bd3b20dd52663afca04ca743808b1d6a9521f/contracts/eclp/GyroECLPMath.sol#L47C6-L47C6
    },
    {
      message: "Beta must be greater than alpha",
    },
  );

export const Gyro2DataSchema = BasePoolSchema.extend({
  sqrtAlpha: z.coerce.number().min(0), //source: https://github.com/gyrostable/concentrated-lps/blob/7e9bd3b20dd52663afca04ca743808b1d6a9521f/contracts/2clp/Gyro2CLPPool.sol#L51
  sqrtBeta: z.coerce.number().min(0), //source: https://github.com/gyrostable/concentrated-lps/blob/7e9bd3b20dd52663afca04ca743808b1d6a9521f/contracts/2clp/Gyro2CLPPool.sol#L51
  tokens: z.array(BaseTokenSchema).length(2),
}).refine(
  (data) => {
    return data.sqrtBeta > data.sqrtAlpha; //source: https://github.com/gyrostable/concentrated-lps/blob/7e9bd3b20dd52663afca04ca743808b1d6a9521f/contracts/2clp/Gyro2CLPPool.sol#L51
  },
  {
    message: "Beta must be greater than alpha",
  },
);

export const Gyro3DataSchema = BasePoolSchema.extend({
  root3Alpha: z.coerce.number().min(0), //source: https://github.com/gyrostable/concentrated-lps/blob/7e9bd3b20dd52663afca04ca743808b1d6a9521f/contracts/3clp/Gyro3CLPPool.sol#L98
  tokens: z.array(BaseTokenSchema).length(3),
});

export const FxDataSchema = BasePoolSchema.extend({
  // source: https://etherscan.io/address/0x55bec22f8f6c69137ceaf284d9b441db1b9bfedc#code
  alpha: z.coerce.number().positive().max(100),
  beta: z.coerce.number().positive().max(100),
  lambda: z.coerce.number().positive().max(100),
  delta: z.coerce.number().positive(),
  epsilon: z.coerce.number().positive().max(100),
  tokens: z.array(BaseTokenSchema).length(2),
})
  .refine(
    (data) => {
      return data.beta < data.alpha;
    },
    {
      message: "Alpha must be greater than beta",
    },
  )
  .refine(
    (data) => {
      const feeAtHalt = (data.delta * (2 - (data.alpha - data.beta))) / 100;
      return feeAtHalt < 50;
    },
    {
      message:
        "Fee at halt must be less than 50%. Fee at halt is calculated as (delta * (2 - (alpha - beta)))",
    },
  );

// TODO: Rename this to StableSwapDataSchema when pool simulator is finished
export const StableSwapSimulatorDataSchema = BasePoolSchema.extend({
  ampFactor: z.coerce.number().positive().min(1).max(5000), //source: https://github.com/balancer/balancer-v2-monorepo/blob/c4cc3d466eaa3c1e5fa62d303208c6c4a10db48a/pkg/pool-stable/contracts/StableMath.sol#L28
  tokens: z
    .array(
      BaseTokenSchema.extend({
        rate: z.coerce.number().positive(),
      }),
    )
    .min(2)
    .max(5),
});
