import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import * as Separator from "@radix-ui/react-separator";
import * as Tabs from "@radix-ui/react-tabs";
import { usePathname } from "next/navigation";

import Sidebar from "#/components/Sidebar";

import BaselineDataForm from "./BaselineDataForm";
import InitialDataForm from "./InitialDataForm";
import { SearchPoolFormDialog } from "./SearchPoolFormDialog";
import VariantDataForm from "./VariantDataForm";

function AnalysisMenu() {
  return (
    <div>
      <Tabs.Root
        className="flex flex-col w-full h-full shadow-[0_2px_10px] shadow-blue2 bg-blue2 text-gray-600"
        defaultValue="variantData"
      >
        <Tabs.List className="shrink-0 flex border-b border-blue1 bg-blue3">
          <Tabs.Trigger
            className="px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] hover:text-white hover:bg-blue4 data-[state=active]:text-white data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:gray-800 data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow:gray-800 outline-none cursor-default"
            value="baselineData"
          >
            <div className="flex justify-center items-center h-screen gap-x-3">
              <div className="w-3 h-3 rounded-full bg-blue-700" />
              Initial
            </div>
          </Tabs.Trigger>
          <Tabs.Trigger
            className="px-5 h-[45px] flex-1 flex items-center justify-center text-[15px] hover:text-white hover:bg-blue4 data-[state=active]:text-white data-[state=active]:shadow-[inset_0_-1px_0_0,0_1px_0_0] data-[state=active]:gray-800 data-[state=active]:focus:shadow-[0_0_0_2px] data-[state=active]:focus:shadow:gray-800 outline-none cursor-default"
            value="variantData"
          >
            <div className="flex justify-center items-center h-screen gap-x-3">
              <div className="w-3 h-3 rounded-full bg-yellow-700" />
              New
            </div>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content
          className="grow p-5 bg-blue2 outline-none"
          value="baselineData"
        >
          <Sidebar.Header name="Baseline parameters" />
          <Sidebar.Content>
            <BaselineDataForm />
          </Sidebar.Content>
        </Tabs.Content>
        <Tabs.Content
          className="grow p-5 bg-blue2 outline-none"
          value="variantData"
        >
          <Sidebar.Header name="Variant parameters" />
          <Sidebar.Content>
            <VariantDataForm />
          </Sidebar.Content>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}

function IndexMenu() {
  return (
    <>
      <SearchPoolFormDialog>
        <span className="text-sm font-normal text-slate12 cursor-pointer flex items-center space-x-2">
          <MagnifyingGlassIcon width="16" height="16" strokeWidth={1} />
          <span>Import pool parameters</span>
        </span>
      </SearchPoolFormDialog>
      <Separator.Root className="bg-blue6 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px my-5" />
      <Sidebar.Header name="Initial parameters" />
      <Sidebar.Content>
        <InitialDataForm />
      </Sidebar.Content>
    </>
  );
}

export default function Menu() {
  const pathname = usePathname();
  if (pathname.includes("/analysis")) {
    return <AnalysisMenu />;
  }
  return <IndexMenu />;
}
