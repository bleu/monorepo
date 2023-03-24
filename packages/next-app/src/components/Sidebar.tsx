import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useState } from "react";

import { Actions } from "#/app/daoadmin/(components)/Actions";
import { ActionAttribute, useAdminTools } from "#/contexts/AdminToolsContext";
import { hardcodedData } from "#/utils/hardcodedData";

import { FilterDropdown, IFilter } from "./FilterDropdown";

export function Sidebar() {
  const data = hardcodedData;
  const [querySearch, setQuerySearch] = useState("");
  const { selectedAction, handleSetAction, selectedFilters } = useAdminTools();

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setQuerySearch(e.currentTarget.value);
  };

  const filteredActionsByTag =
    selectedFilters["operation-responsible"] !== ""
      ? data.actions.filter(
          (item) =>
            item.operationResponsible ===
            selectedFilters["operation-responsible"]
        )
      : data.actions;

  const filteredActionsByName = filteredActionsByTag.filter((item) =>
    item.name.toLowerCase().includes(querySearch.toLowerCase())
  );

  const filters: IFilter[] = [
    {
      name: "Operation Responsible",
      options: ["Maxis", "Labs"],
    },
  ];

  return (
    <div className="h-full w-96 max-w-full bg-gray-800 py-5">
      <div className="h-screen w-96 max-w-full items-start justify-start space-y-4">
        <div className="items-start justify-start space-y-2.5 self-stretch px-5">
          <div className="flex items-center justify-start space-x-0 text-2xl font-medium text-gray-400">
            <span>DAO Actions</span>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <input
                placeholder="Search for DAO Action"
                className="h-9 w-full appearance-none items-center justify-center rounded-l-[4px] bg-white px-[10px] text-sm leading-none text-gray-400 outline-none"
                onChange={handleSearchChange}
              />
              <button className="h-9 rounded-r-[4px] bg-gray-400 px-2 leading-none outline-none transition hover:bg-gray-500">
                <MagnifyingGlassIcon
                  color="rgb(31 41 55)"
                  className="ml-1 font-semibold"
                  height={20}
                  width={20}
                />
              </button>
            </div>
            <FilterDropdown filters={filters} />
          </div>
        </div>
        <div className="relative max-h-[40rem] self-stretch overflow-auto">
          {filteredActionsByName &&
            filteredActionsByName.map((item: ActionAttribute) => (
              <Link
                key={item.id}
                href={`/daoadmin/action/${item.id}`}
                onClick={() => handleSetAction(item)}
              >
                <Actions
                  key={item.id}
                  isSelected={item.id === selectedAction?.id}
                  action={item as ActionAttribute}
                />
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
