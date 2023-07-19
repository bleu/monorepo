import * as SelectPrimitive from "@radix-ui/react-select";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "#/components/Badge";
import { Select, SelectItem } from "#/components/Select";
import Sidebar from "#/components/Sidebar";
import { ActionAttribute, useAdminTools } from "#/contexts/AdminToolsContext";
import { hardcodedData } from "#/utils/hardcodedData";
import { truncateAddress } from "#/utils/truncate";

interface IFilter {
  name: string;
  options: string[];
}

export function DaoAdminSidebar() {
  const data = hardcodedData;
  const [querySearch, setQuerySearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");
  const { selectedAction, handleSetAction } = useAdminTools();

  const handleSearchChange = (e: React.FormEvent<HTMLInputElement>) => {
    setQuerySearch(e.currentTarget.value);
  };

  const filteredActionsByTag =
    selectedFilter !== ""
      ? data.actions.filter(
          (item) => item.operationResponsible === selectedFilter,
        )
      : data.actions;

  const filteredActionsByName = filteredActionsByTag.filter((item) =>
    item.name.toLowerCase().includes(querySearch.toLowerCase()),
  );

  const filters: IFilter[] = [
    {
      name: "Operation Responsible",
      options: ["Maxis", "Labs"],
    },
  ];

  return (
    <Sidebar>
      <Sidebar.Header name="DAO Actions">
        <div className="flex justify-between">
          <Sidebar.InputFilter
            placeHolder="Search for DAO Action"
            onChange={handleSearchChange}
          />
          <Select
            onValueChange={(value: string) => setSelectedFilter(value)}
            theme={"light"}
          >
            {filters.map((filter) => (
              <SelectPrimitive.Group key={filter.name}>
                <SelectPrimitive.Label className="px-2 py-1 text-sm text-slate12">
                  {filter.name}
                </SelectPrimitive.Label>
                <SelectItem value="" theme={"light"}>
                  No filter
                </SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option} value={option} theme={"light"}>
                    {option}
                  </SelectItem>
                ))}
              </SelectPrimitive.Group>
            ))}
          </Select>
        </div>
      </Sidebar.Header>
      <Sidebar.Content>
        {filteredActionsByName &&
          filteredActionsByName.map((item: ActionAttribute) => (
            <Link
              key={item.id}
              href={`/daoadmin/action/${item.id}`}
              onClick={() => handleSetAction(item)}
            >
              <Sidebar.Item isSelected={item.id === selectedAction?.id}>
                <p className="flex justify-start text-lg font-bold text-slate12 group-hover:text-amber10">
                  {item.name}
                </p>
                <div className="flex w-full items-center space-x-3">
                  {item.operationResponsible && (
                    <Badge isSelected={item.id === selectedAction?.id}>
                      {item.operationResponsible}
                    </Badge>
                  )}
                  <p className="text-sm leading-tight text-slate12 group-hover:text-slate12">
                    {truncateAddress(item.contractAddress)}
                  </p>
                </div>
              </Sidebar.Item>
            </Link>
          ))}
      </Sidebar.Content>
    </Sidebar>
  );
}
