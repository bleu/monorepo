import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import { ReactElement, useEffect, useState } from "react";

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
  FX: "FX",
};

export enum PoolSimulatorFormTabs {
  InitialData = "initialData",
  CustomData = "customData",
}

function IndexMenu() {
  const {
    initialData,
    setInitialData,
    setCustomData,
    customData,
    setIsGraphLoading,
    handleImportPoolParametersById,
    setIsAnalysis,
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
                setInitialData({
                  ...initialData,
                  poolType,
                  poolParams: undefined,
                })
              }
              defaultValue={initialData}
              onTabChanged={(data) => {
                if (typeof customData.poolParams?.swapFee === "undefined") {
                  setCustomData(data);
                }
                setInitialData(data);
              }}
              onSubmit={(data) => {
                if (typeof customData.poolParams?.swapFee === "undefined") {
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
                setCustomData({
                  ...customData,
                  poolType,
                  poolParams: undefined,
                })
              }
              defaultValue={customData}
              onTabChanged={setCustomData}
              onSubmit={(data) => {
                setCustomData(data);
                setIsGraphLoading(true);
                setIsAnalysis(true);
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

export function AnalysisMenu() {
  const {
    initialData,
    setInitialData,
    customData,
    setCustomData,
    setAnalysisTokenByIndex,
    analysisToken,
    setCurrentTabTokenByIndex,
  } = usePoolSimulator();

  const [tabValue, setTabValue] = useState<PoolSimulatorFormTabs>(
    PoolSimulatorFormTabs.InitialData,
  );
  useEffect(() => {
    setAnalysisTokenByIndex(0);
    setCurrentTabTokenByIndex(1);
  }, []);

  const indexCurrentTabToken = initialData?.tokens.findIndex(
    ({ symbol }) => symbol.toLowerCase() !== analysisToken.symbol.toLowerCase(),
  );

  return (
    <>
      <Sidebar.Header name="Simulation menu" />
      <Sidebar.Content>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <span className="mb-2 block text-sm text-slate12">
              Analysis Token
            </span>
            <Select
              onValueChange={(i) => {
                if (indexCurrentTabToken === Number(i)) {
                  setCurrentTabTokenByIndex(
                    initialData?.tokens.findIndex(
                      (_, index) => index !== Number(i),
                    ),
                  );
                }
                setAnalysisTokenByIndex(Number(i));
              }}
              defaultValue={"0"}
            >
              {initialData?.tokens.map(({ symbol }, index) => (
                <SelectItem key={symbol} value={index.toString()}>
                  {symbol}
                </SelectItem>
              ))}
            </Select>
          </div>
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
              <div className="flex flex-col">
                <Label className="mb-2 block text-md text-slate12">
                  {POOL_TYPES_MAPPER[initialData.poolType]}
                </Label>
                <PoolParamsForm
                  defaultValue={initialData}
                  onSubmit={setInitialData}
                  submitButtonText="Refresh simulation"
                />
              </div>
            </Tabs.ItemContent>
            <Tabs.ItemContent tabName={PoolSimulatorFormTabs.CustomData}>
              <div className="flex flex-col">
                <Label className="mb-2 block text-md text-slate12">
                  {POOL_TYPES_MAPPER[customData.poolType]}
                </Label>
                <PoolParamsForm
                  defaultValue={customData}
                  onSubmit={setCustomData}
                  submitButtonText="Refresh simulation"
                />
              </div>
            </Tabs.ItemContent>
          </Tabs>
        </div>
      </Sidebar.Content>
    </>
  );
}

export default function Menu() {
  // const pathname = usePathname();
  const { customData, initialData, isAnalysis } = usePoolSimulator();
  // if (pathname.includes("/analysis")) {
  if (isAnalysis) {
    if (
      !initialData ||
      !initialData.poolParams ||
      !customData ||
      !customData.poolParams
    ) {
      return <Spinner />;
    }
    return <AnalysisMenu />;
  }
  return <IndexMenu />;
}
