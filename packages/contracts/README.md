# <h1 align="center"> Balancer Pool Metadata Contract</h1>

This package contains the source code for the Balancer Pool Metadata smart-contract, the [`PoolMetadataRegistry`](./src/PoolMetadataRegistry.sol).

# Getting started

## Filling environment variables

To be able to test and deploy the smart contract, you need to create a `.env` file in the `contracts` directory. Check the [`.env.example`](./.env.template) for information.

## Install dependencies

If you did not clone the repository using the `--recursive-submodules` option, make sure to install the submodules with

```bash
$ git submodule update --init --recursive   # in the balancer-pool-metadata directory
```

```bash
$ pnpm install
```

## Running tests

```bash
$ pnpm test
```

## Deploy to local

We are using an anvil to create a local testnet node for deploying and testing smart contracts. Run the anvil server, get a generated private key in the terminal, and change your `PRIVATE_KEY` in the `.env`. Then deploy with the `deploy:local` command.

```bash
$ pnpm dev:anvil
$ pnpm deploy:local
```

## Deploy to goerli testnet

```bash
$ pnpm deploy:goerli
```
