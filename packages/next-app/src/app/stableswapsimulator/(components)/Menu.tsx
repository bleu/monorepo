import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

import Sidebar from "#/components/Sidebar";
import { Tabs } from "#/components/Tabs";

import BaselineDataForm from "./BaselineDataForm";
import InitialDataForm from "./InitialDataForm";
import { SearchPoolFormDialog } from "./SearchPoolFormDialog";
import VariantDataForm from "./VariantDataForm";

function AnalysisMenu() {
  return (
    <div>
      <Tabs>
        <Tabs.ItemTriggerWrapper>
          <Tabs.ItemTrigger tabName="baselineData">
            <span>Baseline</span>
          </Tabs.ItemTrigger>
          <Tabs.ItemTrigger tabName="variantData" color="AMBER">
            <span>Variant</span>
          </Tabs.ItemTrigger>
        </Tabs.ItemTriggerWrapper>
        <Tabs.ItemContent tabName="baselineData">
          <SearchPoolFormWithDataForm>
            <BaselineDataForm />
          </SearchPoolFormWithDataForm>
        </Tabs.ItemContent>
        <Tabs.ItemContent tabName="variantData">
          <Sidebar.Header name="Variant parameters" />
          <Sidebar.Content>
            <VariantDataForm />
          </Sidebar.Content>
        </Tabs.ItemContent>
      </Tabs>
    </div>
  );
}

function IndexMenu() {
  return (
    <SearchPoolFormWithDataForm>
      <InitialDataForm />
    </SearchPoolFormWithDataForm>
  );
}

function SearchPoolFormWithDataForm({ children }: { children: ReactElement }) {
  return (
    <div>
      <SearchPoolFormDialog>
        <span className="text-sm font-normal text-slate12 cursor-pointer flex items-center space-x-2">
          <MagnifyingGlassIcon width="16" height="16" strokeWidth={1} />
          <span>Import pool parameters</span>
        </span>
      </SearchPoolFormDialog>
      <Separator.Root className="bg-blue6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-5" />
      <Sidebar.Header name="Baseline parameters" />
      <Sidebar.Content>{children}</Sidebar.Content>
    </div>
  );
}

export default function Menu() {
  const pathname = usePathname();
  if (pathname.includes("/analysis")) {
    return <AnalysisMenu />;
  }
  return <IndexMenu />;
}
