import { Close, DialogClose } from "@radix-ui/react-dialog";

import { PoolType } from "#/contexts/PoolSimulatorContext";
import { usePoolFormContext } from "#/contexts/PoolSimulatorFormContext";

export function PoolTypeChangeConfirmation({
  selectedType,
}: {
  selectedType: PoolType;
}) {
  // Shouldn't `selectedType` be the same as `data.poolType`?
  const { setData, data } = usePoolFormContext();
  return (
    <div className="text-slate12 flex flex-col items-center gap-y-4">
      <div className="text-center flex flex-col items-center">
        <span>You are about to change the pool type to {selectedType}</span>
        <span>This action will reset all the parameters.</span>
      </div>
      <div className="flex gap-x-4 py-3">
        <DialogClose>
          <span className="bg-transparent text-slate9 border-slate9 hover:bg-slate2 hover:border-slate2 rounded-md py-3 px-5 text-center text-sm font-semibold border focus-visible:outline-blue7 focus-visible:outline-offset-2 disabled:opacity-40">
            Cancel
          </span>
        </DialogClose>
        <DialogClose
          onClick={() =>
            setData({
              tokens: data.tokens,
              poolType: selectedType,
              poolParams: undefined,
            })
          }
        >
          <span className="bg-blue9 text-slate12 hover:bg-blue10 border-blue9 rounded-md py-3 px-5 text-center text-sm font-semibold border focus-visible:outline-blue7 focus-visible:outline-offset-2 disabled:opacity-40">
            Confirm
          </span>
        </DialogClose>
      </div>
    </div>
  );
}
