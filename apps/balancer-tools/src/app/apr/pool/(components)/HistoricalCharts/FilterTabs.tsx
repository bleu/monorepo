import clsx from "clsx";
import React from "react";

export default function FilterTabs({
  tabs,
  selectedTabs,
  setSelectedTabs,
}: {
  tabs: string[];
  selectedTabs: number[];
  setSelectedTabs: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  const handleTabClick: React.MouseEventHandler<HTMLDivElement> = (evt) => {
    const clickedTab = evt.currentTarget as HTMLDivElement;
    const idx = parseInt(clickedTab.id);
    if (selectedTabs.includes(idx)) {
      // Tab is already selected, so remove it
      const updatedSelectedTabs = selectedTabs.filter(
        (tabIdx) => tabIdx !== idx,
      );
      setSelectedTabs(updatedSelectedTabs);
    } else {
      // Tab is not selected, so add it
      setSelectedTabs([...selectedTabs, idx]);
    }
  };

  return (
    <div className="overflow-hidden grid grid-cols-2 sm:flex sm:flex-wrap rounded-full p-1 justify-self-center col-span-full border border-blue6 bg-blue3 select-none">
      {tabs.map((tabTitle, idx) => (
        <div
          className="cursor-pointer flex grow justify-center items-center sm:min-w-[96px] min-w-[76px] sm:h-9 h-7 rounded-full"
          role="radio"
          aria-checked={selectedTabs.includes(idx)}
          tabIndex={idx}
          id={String(idx)}
          data-headlessui-state="checked"
          onClick={handleTabClick}
        >
          <div
            id={String(idx)}
            className={clsx([
              "sm:text-sm text-xs font-medium whitespace-nowrap text-slate11 w-fit",
              selectedTabs.includes(idx) ? "text-white" : "",
            ])}
          >
            {tabTitle}
          </div>
        </div>
      ))}
    </div>
  );
}
