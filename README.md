# <h1 align="center"> Balancer DAO Admin Tools </h1>

Balancer DAO is responsible for running the protocol operations, e.g. adding reward tokens, registering gauges, etc. For this, they have to build the transactions (encode the function, call the contracts, etc) and execute them on-chain. Performing these actions manually is error-prone and time-consuming - also, many of the actions performed by the DAO are irreversible.

This is a Gnosis Safe App containing a set of common DAO actions to be proposed/executed seamlessly. Through this App, a Balancer Maxi, for instance, could just select the action `Register Gauge to Controller` and pass the required arguments and automatically the transactions will be created and proposed to the DAO's multisig.


## Structure

The project uses a monorepo structure and git submodules to organize its codebase. All packages can be found in the [`packages`](./packages) directory. The packages directory contains all the packages that make up the project.

## Packages

- [`next-app`](./packages/next-app): UI where the user can connect wallets, view and configurate the avaliable actions, and send them to the DAO's multisig. 

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
git clone --recurse-submodules git@github.com:bleu-studio/balancer-admin-tools.git
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
