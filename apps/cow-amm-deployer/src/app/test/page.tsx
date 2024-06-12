/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import {
  Badge,
  Card,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TabsContent,
  TabsList,
  TabsRoot,
  TabsTrigger,
} from "@bleu/ui";
import { Slot } from "@radix-ui/react-slot";
import { ArrowUpRight, ChevronRight, MoreHorizontal } from "lucide-react";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
// import { Card, Card.Content } from "@/components/ui/card";
import dynamic from "next/dynamic";
import Link from "next/link";
/* eslint-disable no-console */
import React from "react";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

import { Button } from "#/components";
import {
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValue,
} from "#/components/Select";
import { cn } from "#/lib/utils";

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & {
    separator?: React.ReactNode;
  }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol">
>(({ className, ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5",
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1.5", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & {
    asChild?: boolean;
  }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      ref={ref}
      className={cn("transition-colors hover:text-foreground", className)}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn("font-normal text-foreground", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("[&>svg]:size-3.5", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn("flex h-9 w-9 items-center justify-center", className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbElipssis";

interface ChartComponentProps {
  data: any;
  layout: any;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data, layout }) => (
  <Card.Root className="w-full border-white bg-primary overflow-visible max-w-full rounded-none">
    <Card.Content>
      <Plot data={data} layout={layout} />
    </Card.Content>
  </Card.Root>
);

interface HeaderProps {
  poolName: string;
  version: string;
  apr: string;
  fee: string;
  network: string;
  token1: string;
  token2: string;
}

const Header: React.FC<HeaderProps> = ({
  poolName,
  version,
  apr,
  fee,
  network,
  token1,
  token2,
}) => (
  <Card.Root className="w-full border-white bg-primary overflow-visible max-w-full rounded-none">
    <Card.Header>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/pools">Pools</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Card.Title className="text-2xl mt-2">
        {poolName} <span className="text-purple-500">{version}</span>
      </Card.Title>
      <Card.Description className="flex space-x-4 mt-2">
        <span>APR: {apr}</span>
        <span>Fee: {fee}</span>
        <span>Network: {network}</span>
        <span>{token1}</span>
        <span>{token2}</span>
      </Card.Description>
    </Card.Header>
  </Card.Root>
);
// import React from "react";
// import ChartComponent from "./ChartComponent";
// import { Button } from "@/components/ui/button";
// import { Card, Card.Content, Card.Header, Card.Title } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import React from "react";
// import ChartComponent from "./ChartComponent";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface ManageProps {
  onAdd: () => void;
  onRemove: () => void;
  onStake: () => void;
  onUnstake: () => void;
  tokens: string[];
  balance: string;
  rewards: string;
}

const Manage: React.FC<ManageProps> = ({
  onAdd,
  onRemove,
  onStake,
  onUnstake,
  tokens,
  balance,
}) => {
  return (
    <Card.Root className="bg-gray-900 text-white overflow-visible max-w-full rounded-none">
      <Card.Content>
        <TabsRoot defaultValue="add">
          <TabsList>
            <TabsTrigger value="add">Add</TabsTrigger>
            <TabsTrigger value="remove">Remove</TabsTrigger>
            <TabsTrigger value="stake">Stake</TabsTrigger>
            <TabsTrigger value="unstake">Unstake</TabsTrigger>
          </TabsList>
          <TabsContent value="add">
            <div className="add-liquidity mb-4">
              <Card.Header>
                <Card.Title className="text-xl mb-2">Add Liquidity</Card.Title>
              </Card.Header>
              <Card.Content className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="token1">Token 1</Label>
                  <Input type="number" placeholder="0.0" id="token1" />
                  <span>{tokens[0]}</span>
                </div>
                <div className="flex-1">
                  <Label htmlFor="token2">Token 2</Label>
                  <Input type="number" placeholder="0.0" id="token2" />
                  <span>{tokens[1]}</span>
                </div>
              </Card.Content>
              <Button className="mt-4" onClick={onAdd}>
                Connect Wallet
              </Button>
            </div>
          </TabsContent>
          <TabsContent value="remove">
            <Button className="mt-4" onClick={onRemove}>
              Remove Liquidity
            </Button>
          </TabsContent>
          <TabsContent value="stake">
            <Button className="mt-4" onClick={onStake}>
              Stake
            </Button>
          </TabsContent>
          <TabsContent value="unstake">
            <Button className="mt-4" onClick={onUnstake}>
              Unstake
            </Button>
          </TabsContent>
        </TabsRoot>
      </Card.Content>
    </Card.Root>
  );
};

interface AddLiquidityProps {
  onNetworkChange: (value: string) => void;
  onTokenChange: (value: string, token: string) => void;
  onDeposit: () => void;
  tokens: string[];
}

const CreateAMM: React.FC<AddLiquidityProps> = ({
  onNetworkChange,
  onTokenChange,
  onDeposit,
  tokens,
}) => (
  <Card.Root className="w-full border-white bg-primary overflow-visible max-w-full rounded-none">
    <Card.Header>
      <Card.Title className="text-xl mb-4">Create AMM</Card.Title>
    </Card.Header>
    <Card.Content>
      <div className="mb-4">
        <Label htmlFor="network">Network</Label>
        <SelectRoot onValueChange={onNetworkChange}>
          <SelectTrigger id="network">
            <SelectValue placeholder="Select Network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Ethereum">Ethereum</SelectItem>
            {/* Add more networks as needed */}
          </SelectContent>
        </SelectRoot>
      </div>
      <div className="mb-4">
        <Label htmlFor="tokens">Tokens</Label>
        <div className="flex space-x-4">
          <SelectRoot onValueChange={(value) => onTokenChange(value, "token1")}>
            <SelectTrigger id="tokens1">
              <SelectValue placeholder="Select Token 1" />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token, index) => (
                <SelectItem key={index} value={token}>
                  {token}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
          <SelectRoot onValueChange={(value) => onTokenChange(value, "token2")}>
            <SelectTrigger id="tokens2">
              <SelectValue placeholder="Select Token 2" />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token, index) => (
                <SelectItem key={index} value={token}>
                  {token}
                </SelectItem>
              ))}
            </SelectContent>
          </SelectRoot>
        </div>
      </div>
      <div className="mb-4">
        <Label htmlFor="deposit">Deposit</Label>
        <div className="flex space-x-4">
          <Input type="number" placeholder="0.0" id="deposit1" />
          <Input type="number" placeholder="0.0" id="deposit2" />
        </div>
      </div>
      <Button onClick={onDeposit}>Connect Wallet</Button>
    </Card.Content>
  </Card.Root>
);

interface PoolCompositionProps {
  tokens: string[];
  totalSupply: string;
}

const PoolComposition: React.FC<PoolCompositionProps> = ({
  tokens,
  totalSupply,
}) => (
  <Card.Root className="w-full border-white bg-primary overflow-visible max-w-full rounded-none">
    <Card.Content>
      <Card.Header>
        <Card.Title className="text-xl mb-2">Pool Composition</Card.Title>
        <p className="text-gray-400 mb-4">Details of your pool composition</p>
      </Card.Header>
      <Card.Content>
        <div className="tokens-composition mb-4">
          <div className="flex space-x-4 mt-4">
            {tokens.map((token, index) => (
              <div key={index} className="flex-1">
                <Label htmlFor={`token${index}`}>Token {index + 1}</Label>
                <p id={`token${index}`} className="text-lg">
                  {token}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="total-supply">
          <Card.Title className="text-xl mb-2">Total Supply</Card.Title>
          <p>{totalSupply}</p>
        </div>
      </Card.Content>
    </Card.Content>
  </Card.Root>
);
interface Order {
  poolName: string;
  type: string;
  status: string;
  date: string;
  amount: string;
  email: string;
}

interface PoolsLastOrdersProps {
  orders: Order[];
}

const PoolsLastOrders: React.FC<PoolsLastOrdersProps> = ({ orders }) => {
  return (
    <Card.Root className="w-full border-white bg-primary overflow-visible max-w-full rounded-none">
      <Card.Header className="flex flex-row items-center">
        <div className="grid gap-2">
          <Card.Title>Recent Pool Orders</Card.Title>
          <Card.Description>
            Details of the latest orders in your pools.
          </Card.Description>
        </div>
        <Button asChild size="sm" className="ml-auto gap-1">
          <Link href="#">
            View All
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Button>
      </Card.Header>
      <Card.Content>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pool</TableHead>
              <TableHead className="hidden xl:table-column">
                Order Type
              </TableHead>
              <TableHead className="hidden xl:table-column">Status</TableHead>
              <TableHead className="hidden xl:table-column">Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="font-medium">{order.poolName}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {order.email}
                  </div>
                </TableCell>
                <TableCell className="hidden xl:table-column">
                  {order.type}
                </TableCell>
                <TableCell className="hidden xl:table-column">
                  <Badge className="text-xs" variant="outline">
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell lg:hidden xl:table-column">
                  {order.date}
                </TableCell>
                <TableCell className="text-right">{order.amount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card.Content>
    </Card.Root>
  );
};

const App: React.FC = () => {
  const tokens = ["ILV", "ETH"];
  const totalSupply = "1000";
  const orders = [
    {
      poolName: "ETH/DAI",
      type: "Stake",
      status: "Approved",
      date: "2023-06-23",
      amount: "250.00",
      email: "user1@example.com",
    },
    {
      poolName: "BTC/USDC",
      type: "Unstake",
      status: "Declined",
      date: "2023-06-24",
      amount: "150.00",
      email: "user2@example.com",
    },
    // Add more orders as needed
  ];

  const data = [
    {
      x: ["1D", "1W", "1M", "1Y"],
      y: [20, 25, 22, 24],
      type: "scatter",
      mode: "lines+markers",
      marker: { color: "rgb(75, 192, 192)" },
    },
  ];

  const layout = {
    title: "Total Supply",
    xaxis: { title: "Time" },
    yaxis: { title: "Value" },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: { color: "#ffffff" },
  };

  return (
    <div className="w-full flex flex-col space-y-4 px-32">
      <Header
        poolName="ILV/ETH"
        version="v2"
        apr="3.39%"
        fee="0.3%"
        network="Ethereum"
        token1="ILV 0x76F...ca0E"
        token2="ETH 0xC02a...6Cc2"
      />
      <div className="flex flex-row w-full space-x-4">
        <div className="w-2/3">
          <Manage
            onAdd={() => alert("Add")}
            onRemove={() => alert("Remove")}
            onStake={() => alert("Stake")}
            onUnstake={() => alert("Unstake")}
            tokens={tokens.slice(0, 2)}
            balance="$0.00"
            rewards="$0.00"
          />
        </div>
        <div className="flex flex-col space-y-4 w-1/3">
          <PoolComposition tokens={tokens} totalSupply={totalSupply} />
          <PoolsLastOrders orders={orders} />
        </div>
      </div>
      <div className="w-full">
        <CreateAMM
          onNetworkChange={(e) => console.log("Network:", e.target.value)}
          onTokenChange={(e, token) => console.log(`${token}:`, e.target.value)}
          onDeposit={() => alert("Deposit")}
          tokens={tokens}
        />

        <ChartComponent data={data} layout={layout} />
      </div>
    </div>
  );
};

export default App;
