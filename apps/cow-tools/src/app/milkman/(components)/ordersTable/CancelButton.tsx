import { TrashIcon } from "@radix-ui/react-icons";

import { cn } from "#/lib/utils";

export function CancelButton({ disabled }: { disabled: boolean }) {
  return (
    <button type="button" className="flex items-center" disabled={disabled}>
      <TrashIcon
        className={cn(
          "h-5 w-5",
          disabled ? "text-slate10" : "text-tomato9 hover:text-tomato10",
        )}
      />
    </button>
  );
}
