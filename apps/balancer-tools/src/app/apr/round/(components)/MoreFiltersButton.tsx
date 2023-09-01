"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "#/components/Accordion";
import { Checkbox } from "#/components/Checkbox";
import { BaseInput } from "#/components/Input";
import { POOLS_WITH_LIVE_GAUGES } from "#/lib/balancer/gauges";

import { PoolTypeEnum } from "../../(utils)/calculatePoolStats";

const AVALIABLE_NETWORKS = [
  ...new Set(POOLS_WITH_LIVE_GAUGES.map((pool) => pool.chain)),
];

interface SelectedAttributesType {
  [key: string]: string | string[] | null;
  network: string[];
  types: string[];
  minTvl: null;
  maxTvl: null;
  minApr: null;
  maxApr: null;
  minVotingShare: null;
  maxVotingShare: null;
}

export function MoreFiltersButton() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const filters = [
    { name: "network", label: "Network", options: AVALIABLE_NETWORKS },
    { name: "types", label: "Pool type", options: Object.values(PoolTypeEnum) },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedAttributes, setSelectedAttributes] =
    useState<SelectedAttributesType>({
      network: [] as string[],
      types: [] as string[],
      minTvl: null,
      maxTvl: null,
      minApr: null,
      maxApr: null,
      minVotingShare: null,
      maxVotingShare: null,
    });

  useEffect(() => {
    const valuesAttributes = [
      "minTvl",
      "maxTvl",
      "minApr",
      "maxApr",
      "minVotingShare",
      "maxVotingShare",
    ];
    const arrayAttributes = ["network", "types"];
    const updatedAttributes = { ...selectedAttributes };
    valuesAttributes.forEach((value) => {
      const paramValue = searchParams.get(value);
      if (paramValue !== null) {
        updatedAttributes[value] = paramValue;
      }
    });

    arrayAttributes.forEach((value) => {
      if (searchParams.has(value)) {
        setSelectedAttributes((prevAttributes) => ({
          ...prevAttributes,
          [value]: searchParams.get(value)?.split(",") || [],
        }));
      }
    });
    setSelectedAttributes(updatedAttributes);
  }, []);

  const pushQueryparamsURL = () => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    Object.entries(selectedAttributes).map(([name, values]) => {
      if (values && values.length) {
        current.set(name, Array.isArray(values) ? values.join(",") : values);
      } else {
        current.delete(name);
      }
    });

    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(pathname + query, { scroll: false });
  };

  const handleAttributeChange = (type: string, value: string) => {
    setSelectedAttributes((prevAttributes) => {
      const updatedAttributes = {
        ...prevAttributes,
        [type]: prevAttributes[type]?.includes(value)
          ? prevAttributes[type]?.filter((v) => v !== value)
          : [...prevAttributes[type], value],
      };
      return updatedAttributes;
    });
  };

  const handleOnMinMaxChange = (
    inputName: keyof SelectedAttributesType,
    value: string,
  ) => {
    setSelectedAttributes((prevAttributes) => {
      const updatedAttributes = {
        ...prevAttributes,
        [inputName]: value,
      };
      return updatedAttributes;
    });
  };

  useEffect(() => {
    const timer = setTimeout(pushQueryparamsURL, 700);
    return () => {
      clearTimeout(timer);
    };
  }, [selectedAttributes]);

  return (
    <>
      <div className="relative mt-1">
        <div
          className="flex h-full items-center gap-x-2 text-sm font-normal text-slate12 bg-blue4 border border-blue6 px-2 rounded-[4px] cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <MixerHorizontalIcon />
          <span className="font-medium pr-1"> More Filters</span>
          <div></div>
          {isOpen && (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="absolute top-12 left-0 z-50 p-2 flex overflow-y-scroll rounded border-[1px] border-blue6 bg-blue3 scrollbar-thin scrollbar-track-blue2 scrollbar-thumb-slate12 w-60"
            >
              <Accordion.Root className="w-full" type="single" collapsible>
                {filters.map(({ name, label, options }) => (
                  <AccordionItem value={label}>
                    <AccordionTrigger>{label}</AccordionTrigger>
                    <AccordionContent>
                      <div className="ml-2 flex flex-col">
                        {options.map((option) => (
                          <div key={option} className="flex items-center">
                            <Checkbox
                              id={`${name}-${option}`}
                              checked={
                                !!selectedAttributes[name]?.includes(option)
                              }
                              onChange={() =>
                                handleAttributeChange(name, option)
                              }
                              label={option}
                            />
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
                <AccordionItemMinMax
                  name="Tvl"
                  label="TVL"
                  onChange={handleOnMinMaxChange}
                  selectedAttributes={selectedAttributes}
                />
                <AccordionItemMinMax
                  name="Apr"
                  label="APR"
                  onChange={handleOnMinMaxChange}
                  selectedAttributes={selectedAttributes}
                />
                <AccordionItemMinMax
                  name="VotingShare"
                  label="Voting Share (%)"
                  onChange={handleOnMinMaxChange}
                  selectedAttributes={selectedAttributes}
                />
              </Accordion.Root>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function AccordionItemMinMax({
  name,
  label,
  onChange,
  selectedAttributes,
}: {
  name: keyof SelectedAttributesType;
  label: string;
  onChange: (inputName: string, value: string) => void;
  selectedAttributes: SelectedAttributesType;
}) {
  return (
    <AccordionItem value={String(name)}>
      <AccordionTrigger>{label}</AccordionTrigger>
      <AccordionContent>
        <div className="py-2 flex flex-col">
          <div className="flex items-center gap-1">
            <BaseInput
              className="flex-1"
              name={`min${name}`}
              placeholder="Minimum"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange(`min${name}`, e.target.value)
              }
              value={selectedAttributes[`min${name}`] || ""}
            />
            <span>-</span>
            <BaseInput
              className="flex-1"
              name={`max${name}`}
              placeholder="Maximum"
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onChange(`max${name}`, e.target.value)
              }
              value={selectedAttributes[`max${name}`] || ""}
            />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
