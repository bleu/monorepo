import { isAddress } from "viem";
import { z } from "zod";

const baseAddressValidation = z
  .string()
  .min(1)
  .refine((value) => isAddress(value), {
    message: "Provided address is invalid",
  });

export const baseOrderSchema = z
  .object({
    tokenSellAddress: baseAddressValidation,
    tokenSellAmount: z.number().positive(),
    tokenBuyAddress: baseAddressValidation,
    receiverAddress: baseAddressValidation,
  })
  .refine(
    (data) => {
      return data.tokenSellAddress != data.tokenBuyAddress;
    },
    {
      message: "Tokens sell and buy addresses must be different",
    }
  );
