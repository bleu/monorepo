

<h1 align="center"> Balancer Pool Metadata - Subgraph</h1>

This package contains the Balancer Pool Metadata subgraph project.

# Getting started

## Prerequisites

Ensure you have installed all project dependencies and deployed the PoolMetadataRegistry contract to local testnet or another network, saving its contract address and deploy block.

## Install Graph-node

Should we address the graph-node here?

## Setting up environment

Define the networks with its respective address and initialBlock on networks.yaml file:

```yaml
mainnet:
  network: mainnet
  EventEmitter:
    address: "0x000000000000000000000000000000000000000"
    startBlock: ??
goerli:
  network: goerli
  PoolMetadataRegistry:
    address: "0x000000000000000000000000000000000000000"
    startBlock: ??

```
Generate types and build the subgraph:

```bash
pnpm codegen
pnpm build
```

## Create and Deploy to local Graph-node

```bash
pnpm create-local
pnpm deploy-local
```

## Create and Deploy to Studio

```bash
...
```

