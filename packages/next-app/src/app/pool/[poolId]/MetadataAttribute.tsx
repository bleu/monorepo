import {
  ArrowTopRightIcon,
  ChevronDownIcon,
  Pencil2Icon,
} from "@radix-ui/react-icons";
import cn from "classnames";
import { TableHTMLAttributes } from "react";

import { Button, ImageDialog } from "../../../components";

const cellData: {
  name: string;
  type: string;
  desc: string;
  value: React.ReactNode;
}[] = [
  {
    name: "Pool Address",
    type: "address",
    desc: "The address of the smart contract that implements the exchange pool",
    value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  },
  {
    name: "Pool link",
    type: "URL",
    desc: "The address of the smart contract that implements the exchange pool",
    value: "https://github.com/",
  },
  {
    name: "Pool Address",
    type: "address",
    desc: "The address of the smart contract that implements the exchange pool",
    value: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
  },
  {
    name: "Pool link",
    type: "URL",
    desc: "The address of the smart contract that implements the exchange pool",
    value: "https://github.com/",
  },
  {
    name: "Pool image",
    type: "image",
    desc: "balancer logo",
    value: "https://s2.coinmarketcap.com/static/img/coins/200x200/5728.png",
  },
];

type CellProps = TableHTMLAttributes<HTMLTableCellElement>;

const Th = ({ className, children }: CellProps) => (
  <th
    scope="col"
    className={cn(
      "py-3.5 px-3 text-left text-sm font-semibold text-white",
      className
    )}
  >
    {children}
  </th>
);

const Header = () => {
  const cols = [
    {
      node: <span className="sr-only">Edit</span>,
      className: "relative py-3.5 pl-3 pr-4 sm:pr-0",
    },
    { node: "Name" },
    { node: "Type" },
    { node: "Description" },
    { node: "Value" },
  ];

  return (
    <thead>
      <tr>
        {cols.map(({ node, className }, index) => (
          <Th key={index} className={className}>
            {node}
          </Th>
        ))}
      </tr>
    </thead>
  );
};

const Td = ({ className, children }: CellProps) => {
  return (
    <td className={cn("whitespace py-4 px-3 text-sm text-gray-300", className)}>
      {children}
    </td>
  );
};

const AttributeLink = ({ data }: { data: (typeof cellData)[1] }) => {
  switch (data.type) {
    case "URL":
      return (
        <button>
          <ArrowTopRightIcon className="text-white" />
        </button>
      );
    case "image":
      return (
        <button>
          <ImageDialog src={data.value as string} />
        </button>
      );
    default:
      return <></>;
  }
};

function Row({ data }: { data: (typeof cellData)[1] }) {
  return (
    <tr>
      <Td>
        <button className="flex items-center">
          <Pencil2Icon className="text-yellow-400" />
        </button>
      </Td>
      <Td className="min-w-[10rem]">{data.name}</Td>
      <Td>{data.type}</Td>
      <Td>{data.desc}</Td>
      <Td>
        <div className="flex justify-between gap-2">
          {data.value}
          <AttributeLink data={data} />
        </div>
      </Td>
    </tr>
  );
}

export function MetadataAttribute({ poolId }: { poolId: string }) {
  return (
    <div className="w-full bg-gray-900">
      <div className="pr-4 sm:pr-6 lg:pr-12">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="mx-1 text-2xl font-medium text-gray-400">
              Metadata attributes - Pool #{poolId}
            </h1>
          </div>
        </div>

        <div className="mt-4 flow-root rounded-md border border-gray-700 bg-gray-800">
          <table className="min-w-full divide-y divide-gray-700">
            <Header />

            <tbody className="divide-y divide-gray-800">
              {cellData.map((item, index) => (
                <Row key={index} data={item} />
              ))}
            </tbody>
          </table>

          <div className="flex h-10 w-full items-center justify-center border-y border-gray-700">
            <button className="text-gray-700 ">
              <div className="flex items-center">
                <span>load more</span>
                <ChevronDownIcon
                  width="20"
                  height="20"
                  className=" text-gray-700"
                />
              </div>
            </button>
          </div>
        </div>
        <div className="mt-5 w-full justify-between sm:flex sm:items-center">
          <div className="flex gap-4">
            <Button className="bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline-indigo-500">
              Add new attribute
            </Button>
            <Button className="border border-blue-500 bg-gray-900  text-blue-500 hover:bg-gray-800 focus-visible:outline-indigo-500">
              Import template
            </Button>
          </div>
          <Button className="bg-yellow-400 text-gray-900 hover:bg-yellow-300 focus-visible:bg-yellow-300">
            Update metadata
          </Button>
        </div>
      </div>
    </div>
  );
}
