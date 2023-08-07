import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import { type ReactElement } from "react";

import Sidebar from "#/components/Sidebar";
import { Spinner } from "#/components/Spinner";
import { Tabs } from "#/components/Tabs";
import { useStableSwap } from "#/contexts/StableSwapContext";

import CustomDataForm from "./CustomDataForm";
import InitialDataForm from "./InitialDataForm";
import InitialEmptyDataForm from "./InitialEmptyDataForm";
import { SearchPoolFormDialog } from "./SearchPoolFormDialog";

function AnalysisMenu() {
  return (
    <div>
      <Tabs defaultValue="customData">
        <Tabs.ItemTriggerWrapper>
          <Tabs.ItemTrigger tabName="initialData" color="blue7">
            <span>Initial</span>
          </Tabs.ItemTrigger>
          <Tabs.ItemTrigger tabName="customData" color="amber9">
            <span>Custom</span>
          </Tabs.ItemTrigger>
        </Tabs.ItemTriggerWrapper>
        <Tabs.ItemContent tabName="initialData">
          <SearchPoolFormWithDataForm>
            <InitialDataForm />
          </SearchPoolFormWithDataForm>
        </Tabs.ItemContent>
        <Tabs.ItemContent tabName="customData">
          <Sidebar.Header name="Custom parameters" />
          <Sidebar.Content>
            <CustomDataForm />
          </Sidebar.Content>
        </Tabs.ItemContent>
      </Tabs>
    </div>
  );
}

function IndexMenu() {
  return (
    <SearchPoolFormWithDataForm>
      <InitialEmptyDataForm />
    </SearchPoolFormWithDataForm>
  );
}

function SearchPoolFormWithDataForm({ children }: { children: ReactElement }) {
  return (
    <div>
      <SearchPoolFormDialog>
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
  const { customData, initialData } = useStableSwap();
  if (pathname.includes("/analysis")) {
    if (
      !initialData ||
      !initialData.swapFee ||
      !initialData.ampFactor ||
      !initialData.tokens ||
      !customData ||
      !customData.swapFee ||
      !customData.ampFactor ||
      !customData.tokens
    ) {
      return <Spinner />;
    }
    return <AnalysisMenu />;
  }
  return <IndexMenu />;
}
