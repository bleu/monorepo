"use client";

import { StableSwapSimulatorInitialParametersSchema } from "@balancer-pool-metadata/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import Button from "#/components/Button";
import { Input } from "#/components/Input";
import { useStableSwap } from "#/contexts/StableSwapContext";

export default function PoolParametersForm() {
  const { initialData, setInitialData } = useStableSwap();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<typeof StableSwapSimulatorInitialParametersSchema._type>({
    resolver: zodResolver(StableSwapSimulatorInitialParametersSchema),
  });

  // useEffect(() => {
  //   // TODO: BAL 401
  //   clearErrors();
  // }, [newPoolImportedFlag]);

  return (
    <form
      // TODO: BAL 382
      onSubmit={handleSubmit((data) => setInitialData(data))}
    >
      <div className="flex flex-col gap-4">
        <Input
          placeholder="Define the initial swap fee"
          label="Swap fee"
          type="number"
          {...register("swapFee", {
            valueAsNumber: true,
            value: initialData?.swapFee,
          })}
          errorMessage={errors?.swapFee?.message}
        />
        <Input
          placeholder="Define the initial Amp factor"
          label="Amp factor"
          type="number"
          {...register("ampFactor", {
            valueAsNumber: true,
            value: initialData?.ampFactor,
          })}
          errorMessage={errors?.ampFactor?.message}
        />
        <Button type="submit" shade="light" className="w-32 h-min self-end">
          Next step
        </Button>
      </div>
    </form>
  );
}
