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

const TWAP_DELAY_OPTIONS = [
  { value: String(10 * 60), label: "10 minutes" },
  { value: String(30 * 60), label: "30 minutes" },
  { value: String(60 * 60), label: "1 hour" },
  { value: String(3 * 60 * 60), label: "3 hours" },
  { value: String(12 * 60 * 60), label: "12 hours" },
  { value: String(24 * 60 * 60), label: "1 day" },
];

export function Twap({
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
                  {TWAP_DELAY_OPTIONS.map(({ value, label }) => (
                    <SelectItem key={`${label}-${value}`} value={value}>
                      {label}
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
