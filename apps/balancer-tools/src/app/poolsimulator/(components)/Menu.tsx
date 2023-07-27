import { Close, DialogClose } from "@radix-ui/react-dialog";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import { ReactElement, useState } from "react";

import { Dialog } from "#/components/Dialog";
import { Select, SelectItem } from "#/components/Select";
import Sidebar from "#/components/Sidebar";
import { Spinner } from "#/components/Spinner";
import { Label } from "#/components/ui/label";
import {
  POOL_TYPES,
  PoolType,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";

// import CustomDataForm from "./CustomDataForm"; BAL-499
// import InitialDataForm from "./InitialDataForm"; BAL-499
import { PoolParamsForm } from "./PoolParamsForm";
import { SearchPoolFormDialog } from "./SearchPoolFormDialog";

const POOL_TYPES_MAPPER = {
  MetaStable: "Meta Stable",
  GyroE: "Gyro E-CLP",
};

function IndexMenu() {
  const [open, setOpen] = useState(false);
  const { poolType } = usePoolSimulator();
  const [selectedType, setSelectedType] = useState<PoolType>(poolType);

  function onChange(valeu: PoolType) {
    setSelectedType(valeu);
    setOpen(true);
  }

  function onClose() {
    if (selectedType !== poolType) {
      setSelectedType(poolType);
    }
  }

  return (
    <SearchPoolFormWithDataForm>
      <div className="flex flex-col mt-4">
        <div className="flex flex-col">
          <Dialog
            content={
              <SelectPoolType
                selectedType={selectedType}
                setSelectedType={setSelectedType}
              />
            }
            isOpen={open}
            setIsOpen={setOpen}
            onClose={onClose}
          >
            <div className="flex flex-col mb-4">
              <Label className="mb-2 block text-sm text-slate12">
                Pool type
              </Label>
              <Select onValueChange={onChange} value={selectedType}>
                {POOL_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {POOL_TYPES_MAPPER[type]}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </Dialog>
          <PoolParamsForm />
        </div>
      </div>
    </SearchPoolFormWithDataForm>
  );
}

function SelectPoolType({
  selectedType,
}: {
  selectedType: PoolType;
  setSelectedType: (value: PoolType) => void;
}) {
  const { setPoolType } = usePoolSimulator();

  function onSubmit() {
    setPoolType(selectedType);
    Close;
  }
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
        <DialogClose onClick={onSubmit}>
          <span className="bg-blue9 text-slate12 hover:bg-blue10 border-blue9 rounded-md py-3 px-5 text-center text-sm font-semibold border focus-visible:outline-blue7 focus-visible:outline-offset-2 disabled:opacity-40">
            Confirm
          </span>
        </DialogClose>
      </div>
    </div>
  );
}

function SearchPoolFormWithDataForm({ children }: { children: ReactElement }) {
  const { poolType } = usePoolSimulator();
  return (
    <div>
      <SearchPoolFormDialog poolTypeFilter={poolType}>
        <div className="bg-blue9 p-2 rounded-[4px]">
          <span className="flex cursor-pointer items-center space-x-2 text-sm font-normal text-slate12">
            <MagnifyingGlassIcon width="20" height="20" strokeWidth={1} />
            <span className="font-medium">Import pool parameters</span>
          </span>
        </div>
      </SearchPoolFormDialog>
      <Separator.Root className="my-5 bg-blue6 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" />
      <Sidebar.Header name="Initial parameters" />
      <Sidebar.Content>{children}</Sidebar.Content>
    </div>
  );
}

export default function Menu() {
  const pathname = usePathname();
  const { customData, initialData } = usePoolSimulator();
  if (pathname.includes("/analysis")) {
    if (
      !initialData ||
      !initialData.poolParams ||
      !customData ||
      !customData.poolParams
    ) {
      return <Spinner />;
    }
    return <div className="text-slate12">Analysis Menu</div>;
  }
  return <IndexMenu />;
}
