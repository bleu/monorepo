import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { AlertCard } from "#/components/AlertCard";
import { Input } from "#/components/Input";
import { ammEditSchema, ammFormSchema } from "#/lib/schema";

export function CustomOracleForm({
  form,
}: {
  form: UseFormReturn<
    z.input<typeof ammFormSchema> | z.input<typeof ammEditSchema>
  >;
}) {
  const { register } = form;
  return (
    <div className="flex flex-col gap-y-1">
      <AlertCard style="warning" title="Advanced option">
        <span>
          This options allows you to set specified any contract as the price
          oracle. This is an advanced feature and should be used with caution.
        </span>
      </AlertCard>
      <Input
        label="Price Oracle Address"
        {...register("priceOracleSchema.address")}
        tooltipText="The address of the contract that will be used as the price oracle."
      />
      <Input
        label="Price Oracle Data"
        {...register("priceOracleSchema.data")}
        tooltipText="The bytes data that will be used to query the price oracle."
      />
    </div>
  );
}
