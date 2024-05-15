import { UseFormReturn } from "react-hook-form";

import { AlertCard } from "#/components/AlertCard";
import { Input } from "#/components/Input";
import { ammFormSchema } from "#/lib/schema";

export function CustomPriceCheckerForm({
  form,
}: {
  form: UseFormReturn<typeof ammFormSchema._type>;
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
        {...register("customPriceOracleAddress")}
        tooltipText="The address of the contract that will be used as the price oracle."
      />
      <Input
        label="Price Oracle Data"
        {...register("customPriceOracleData")}
        tooltipText="The bytes data that will be used to query the price oracle."
      />
    </div>
  );
}
