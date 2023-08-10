import { DialogClose } from "@radix-ui/react-dialog";

import { PoolType } from "#/contexts/PoolSimulatorContext";

export function PoolTypeChangeConfirmation({
  selectedType,
  onConfirm,
}: {
  selectedType: PoolType;
  onConfirm: React.MouseEventHandler;
}) {
  return (
    <div className="text-slate12 flex flex-col items-center gap-y-4">
      <div className="text-center flex flex-col items-center">
        <span>You are about to change the pool type to {selectedType}</span>
        <span>This action will reset all the parameters.</span>
      </div>
      <div className="flex gap-x-4 my-3">
        <DialogClose className="bg-transparent text-slate9 border-slate9 hover:bg-slate2 hover:border-slate2 rounded-md py-3 px-5 text-center text-sm font-semibold border focus-visible:outline-blue7 focus-visible:outline-offset-2 disabled:opacity-40">
          Cancel
        </DialogClose>
        <DialogClose
          onClick={onConfirm}
          className="bg-blue9 text-slate12 hover:bg-blue10 border-blue9 rounded-md py-3 px-5 text-center text-sm font-semibold border focus-visible:outline-blue7 focus-visible:outline-offset-2 disabled:opacity-40"
        >
          Confirm
        </DialogClose>
      </div>
    </div>
  );
}
