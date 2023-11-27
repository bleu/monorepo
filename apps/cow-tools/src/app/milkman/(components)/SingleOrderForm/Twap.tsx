import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";

import { Checkbox } from "#/components/Checkbox";
import { Input } from "#/components/Input";
import { Select, SelectItem } from "#/components/Select";
import { Form } from "#/components/ui/form";
import { orderTwapSchema } from "#/lib/schema";

import { TransactionStatus } from "../../utils/type";
import { FormFooter } from "./Footer";

export enum TWAP_DELAY_OPTIONS {
  TEN_MINUTES = "10 minutes",
  THIRTY_MINUTES = "30 minutes",
  ONE_HOUR = "1 hour",
  THREE_HOURS = "3 hours",
  TWELVE_HOURS = "12 hours",
  ONE_DAY = "1 day",
}

export const TwapDelayValues = {
  [TWAP_DELAY_OPTIONS.TEN_MINUTES]: 10 * 60,
  [TWAP_DELAY_OPTIONS.THIRTY_MINUTES]: 30 * 60,
  [TWAP_DELAY_OPTIONS.ONE_HOUR]: 60 * 60,
  [TWAP_DELAY_OPTIONS.THREE_HOURS]: 3 * 60 * 60,
  [TWAP_DELAY_OPTIONS.TWELVE_HOURS]: 12 * 60 * 60,
  [TWAP_DELAY_OPTIONS.ONE_DAY]: 24 * 60 * 60,
};

export function FormTwap({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (data: FieldValues) => void;
  defaultValues?: FieldValues;
}) {
  const form = useForm<typeof orderTwapSchema._type>({
    resolver: zodResolver(orderTwapSchema),
  });

  const { register, setValue, watch, control } = form;

  useEffect(() => {
    register("isTwapNeeded");
    register("delay");
    register("numberOfOrders");
    setValue("isTwapNeeded", defaultValues?.isTwapNeeded);
    setValue("delay", defaultValues?.delay);
    setValue("numberOfOrders", defaultValues?.numberOfOrders);
  }, []);

  const formData = watch();

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-col gap-y-6 p-9">
      <Checkbox
        id="isTwapNeeded"
        checked={formData.isTwapNeeded}
        label="Order will need to be split into multiple orders"
        onChange={() => setValue("isTwapNeeded", !formData.isTwapNeeded)}
      />
      {formData.isTwapNeeded && (
        <div className="flex flex-row justify-between gap-x-7">
          <Input
            type="number"
            label="Number of orders"
            className="w-1/2"
            defaultValue={defaultValues?.numberOfOrders}
            {...register("numberOfOrders")}
          />
          <div className="flex flex-col w-1/2">
            <label className="mb-2 block text-sm text-slate12">Delay</label>
            <Controller
              control={control}
              name="delay"
              defaultValue={defaultValues?.delay}
              render={({ field: { onChange, value, ref } }) => (
                <Select onValueChange={onChange} value={value} ref={ref}>
                  {Object.values(TWAP_DELAY_OPTIONS).map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />
          </div>
        </div>
      )}
      <FormFooter transactionStatus={TransactionStatus.ORDER_TWAP} />
    </Form>
  );
}
