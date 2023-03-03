# <h1 align="center"> Balancer Pool Metadata </h1>

Balancer Pool Metadata is an open-source project that enables pool owners to add metadata to their pools on the Balancer platform. This metadata can include information such as pool name, symbol, description, link, and much more.

By adding metadata to their pools, pool owners can improve the discoverability of their pools on Balancer and make it easier for users to understand the purpose and characteristics of the pool.

The Balancer Pool Metadata project provides an easy-to-use interface for pool owners to add and update their pool metadata, as well as a public Subgraph for developers to access and use the metadata.

## Structure

The project uses a monorepo structure and git submodules to organize its codebase. All packages can be found in the [`packages`](./packages) directory. The packages directory contains all the packages that make up the project.

## Packages

- [`contracts`](./packages/contracts): smart contract responsible for setting/pointing the pool metadata to an IPFS CID.
- [`next-app`](./packages/next-app): UI where pool owners can connect wallets, list the pools they own, and change the metadata.
- [`subgraph`](./packages/subgraph): a simplified version that indexes the events emitted by the smart contract. This API allows for the mapping of Pools to their respective IPFS CIDs, which can be consumed by both our App and external front end.

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
git clone --recurse-submodules https://github.com/bleu-llc/balancer-pool-metadata.git
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
