# <h1 align="center"> Balancer Tools </h1>

The Balancer Tools repository serves as a hub for open-source projects aimed at empowering Balancer users with additional functionalities, analytics, and ease of use. Here, you will find a variety of tools and utilities that can be used to augment your experience as a Balancer user, whether you're a liquidity provider, trader, Maxi or developer.

## Avaliable tools

### [`Pool Metadata`](./packages/balancer.tools/src/app/metadata/)

Balancer Pool Metadata is that enables pool owners to add metadata to their pools on the Balancer platform. This metadata can include information such as pool name, symbol, description, link, and much more.

By adding metadata to their pools, pool owners can improve the discoverability of their pools on Balancer and make it easier for users to understand the purpose and characteristics of the pool.

The Balancer Pool Metadata project provides an easy-to-use interface for pool owners to add and update their pool metadata, as well as a public Subgraph for developers to access and use the metadata.

### [`Internal Manager`](./packages/balancer.tools/src/app/internalmanager/)

The Internal Manager is a user-friendly application that empowers individuals to take control of their internal balance by providing essential features to manage their assets efficiently.

With this app, users can easily deposit, withdraw, and transfer assets within their internal balance, ensuring seamless control over their digital assets.

### [`Stable Swap Simulator`](./packages/balancer.tools/src/app/stableswapsimulator/)

The Stable Swap Simulation is an application designed to provide users with a powerful tool for simulating and analyzing the behavior of stable pools. With this app, users can import pool parameters or create them from scratch to establish reference data.

Then, the parameters can be modifed to compare critical metrics such as Swap, Price Impact, and Depth Cost.

Additionally, the app allows users to simulate a single swap and compare the results with both the reference data and the modified parameters.

## Structure

The project uses a monorepo structure and git submodules to organize its codebase. All packages can be found in the [`packages`](./packages) directory. The packages directory contains all the packages that make up the project.

## Packages

- [`contracts`](./packages/contracts): smart contract responsible for setting/pointing the pool metadata to an IPFS CID.
- [`balancer.tools`](./packages/balancer.tools): UI for all the project's. Each project can be found on the [`app`](./packages/balancer.tools/src/app) folder
- [`subgraph`](./packages/subgraph): a simplified version that indexes the events emitted by the smart contract. This API allows for the mapping of Pools to their respective IPFS CIDs, which can be consumed by both our App and external front end.
- [`gql`](./packages/gql): for GraphQL-related functionality, facilitating communication between the UI and the Subgraph's GraphQL server.
- [`math`](./packages/math): implements the mathematical functions for the functionality of pools, including stable pools.
- [`schema`](./packages/schema): serves as a central repository for managing Zod schemas, ensuring consistency and organization in the project.
- [`shared`](./packages/shared): contains shared code, utilities, and components for improved code reusability and maintainability.
- [`tsconfig`](./packages/tsconfig): typeScript configuration package, enforcing type safety and coding standards.

## Pre-requisites

- The project is built using `Node 18.14.0`.

- [Install Foundry](https://book.getfoundry.sh/getting-started/installation) to your system:

```bash
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc # or open a new terminal
foundryup
```

## Clone

This repository uses git submodules; use `--recurse-submodules` option when cloning:

```bash
git clone --recurse-submodules git@github.com:bleu-studio/balancer-tools.git
```

## Installation

This project requires node v18.14.0. We suggest installing it using [asdf](https://asdf-vm.com/)

```bash
git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.11.1
```

and add binginds to your shell config file.

```bash
asdf plugin add nodejs
asdf install nodejs 18.14.0
```

We use pnpm for package management. To install pnpm, run:

```bash
npm install -g pnpm
```

Install dependencies

```bash
pnpm i
```
