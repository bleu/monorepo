import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import { usePathname, useRouter } from "next/navigation";
import { ReactElement, useState } from "react";

import { Dialog } from "#/components/Dialog";
import { PoolAttribute } from "#/components/SearchPoolForm";
import { Select, SelectItem } from "#/components/Select";
import Sidebar from "#/components/Sidebar";
import { Spinner } from "#/components/Spinner";
import { Tabs, useTabContext } from "#/components/Tabs";
import { Label } from "#/components/ui/label";
import {
  AnalysisData,
  POOL_TYPES,
  PoolType,
  usePoolSimulator,
} from "#/contexts/PoolSimulatorContext";

import { PoolTypeEnum } from "../(types)";
import { PoolParamsForm } from "./PoolParamsForm";
import { PoolTypeChangeConfirmation } from "./PoolTypeChangeConfirmation";
import { SearchPoolFormDialog } from "./SearchPoolFormDialog";

const POOL_TYPES_MAPPER = {
  MetaStable: "Meta Stable",
  GyroE: "Gyro E-CLP",
  Gyro2: "Gyro 2CLP",
  Gyro3: "Gyro 3CLP",
};

export enum PoolSimulatorFormTabs {
  InitialData = "initialData",
  CustomData = "customData",
}

function IndexMenu() {
  const { push } = useRouter();
  const {
    initialData,
    setInitialData,
    setCustomData,
    customData,
    setIsGraphLoading,
    handleImportPoolParametersById,
  } = usePoolSimulator();
  const [tabValue, setTabValue] = useState<PoolSimulatorFormTabs>(
    PoolSimulatorFormTabs.InitialData,
  );

  return (
    <Tabs
      value={tabValue}
      onChange={setTabValue}
      defaultValue={PoolSimulatorFormTabs.InitialData}
    >
      <Tabs.ItemTriggerWrapper>
        <Tabs.ItemTrigger
          tabName={PoolSimulatorFormTabs.InitialData}
          color="blue7"
        >
          <span>Initial</span>
        </Tabs.ItemTrigger>
        <Tabs.ItemTrigger
          tabName={PoolSimulatorFormTabs.CustomData}
          color="amber9"
        >
          <span>Custom</span>
        </Tabs.ItemTrigger>
      </Tabs.ItemTriggerWrapper>
      <Tabs.ItemContent tabName={PoolSimulatorFormTabs.InitialData}>
        <SearchPoolFormWithDataForm
          poolType={initialData.poolType}
          onSubmit={(data) => {
            const setData = (data: AnalysisData) => {
              setInitialData(data);
              setCustomData({ ...customData, tokens: data.tokens });
            };
            handleImportPoolParametersById(data, setData);
          }}
        >
          <div className="flex flex-col mt-4">
            <FormWithPoolType
              onPoolTypeChanged={(poolType) =>
                setInitialData({ ...initialData, poolType })
              }
              defaultValue={initialData}
              onTabChanged={(data) => {
                if (!customData.poolParams?.swapFee) {
                  setCustomData(data);
                }
                setInitialData(data);
              }}
              onSubmit={(data) => {
                if (!customData.poolParams?.swapFee) {
                  setCustomData(data);
                }
                setInitialData(data);
                setTabValue(PoolSimulatorFormTabs.CustomData);
              }}
            />
          </div>
        </SearchPoolFormWithDataForm>
      </Tabs.ItemContent>
      <Tabs.ItemContent tabName={PoolSimulatorFormTabs.CustomData}>
        <SearchPoolFormWithDataForm
          poolType={customData.poolType}
          onSubmit={(data) => {
            handleImportPoolParametersById(
              data,
              ({ poolParams }: AnalysisData) =>
                setCustomData({ ...customData, poolParams }),
            );
          }}
        >
          <div className="flex flex-col mt-4">
            <FormWithPoolType
              onPoolTypeChanged={(poolType) =>
                setCustomData({ ...initialData, poolType })
              }
              defaultValue={customData}
              onTabChanged={setCustomData}
              onSubmit={(data) => {
                setCustomData(data);
                setIsGraphLoading(true);
                push("/poolsimulator/analysis");
              }}
            />
          </div>
        </SearchPoolFormWithDataForm>
      </Tabs.ItemContent>
    </Tabs>
  );
}

function FormWithPoolType({
  defaultValue,
  onSubmit,
  onTabChanged,
  onPoolTypeChanged,
}: {
  defaultValue: AnalysisData;
  onSubmit: (data: AnalysisData) => void;
  onTabChanged: (data: AnalysisData) => void;
  onPoolTypeChanged: (poolType: PoolType) => void;
}) {
  const [open, setOpen] = useState(false);
  const poolType = defaultValue.poolType;
  const [selectedType, setSelectedType] = useState<PoolType>(poolType);

  function onChange(value: PoolType) {
    setSelectedType(value);
    setOpen(true);
  }

  function onClose() {
    if (selectedType !== poolType) {
      setSelectedType(poolType);
    }
  }

  return (
    <div className="flex flex-col">
      <Dialog
        content={
          <PoolTypeChangeConfirmation
            onConfirm={() => onPoolTypeChanged(selectedType)}
            selectedType={selectedType}
          />
        }
        isOpen={open}
        setIsOpen={setOpen}
        onClose={onClose}
      >
        <div className="flex flex-col mb-4">
          <Label className="mb-2 block text-sm text-slate12">Pool type</Label>
          <Select onValueChange={onChange} value={selectedType}>
            {POOL_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {POOL_TYPES_MAPPER[type]}
              </SelectItem>
            ))}
          </Select>
        </div>
      </Dialog>
      <PoolParamsForm
        onTabChanged={onTabChanged}
        defaultValue={defaultValue}
        onSubmit={onSubmit}
      />
    </div>
  );
}

function SearchPoolFormWithDataForm({
  children,
  poolType,
  onSubmit,
}: {
  children: ReactElement;
  poolType: PoolTypeEnum;
  onSubmit: (data: PoolAttribute) => void;
}) {
  const { value: selectedTab } = useTabContext();
  const isCustomData = selectedTab === PoolSimulatorFormTabs.CustomData;

  return (
    <div>
      <SearchPoolFormDialog onSubmit={onSubmit} poolTypeFilter={poolType}>
        <div className="bg-blue9 p-2 rounded-[4px]">
          <span className="flex cursor-pointer items-center space-x-2 text-sm font-normal text-slate12">
            <MagnifyingGlassIcon width="20" height="20" strokeWidth={1} />
            <span className="font-medium">Import pool parameters</span>
          </span>
        </div>
      </SearchPoolFormDialog>
      <Separator.Root className="my-5 bg-blue6 data-[orientation=horizontal]:h-px data-[orientation=vertical]:h-full data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px" />
      <Sidebar.Header
        name={isCustomData ? "Custom parameters" : "Initial parameters"}
      />
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
