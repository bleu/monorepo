# <h1 align="center"> Balancer Pool Metadata - Contract</h1>

This package contains contract sources for the Balancer Pool Metadata Main contract is under `src/PoolMetadataRegistry.sol`.

# Getting started

## Environment variables

Make sure to create your own `.env` (`cp .env.template .env`) and add your variables before testing and trying to deploy the contract.

## Install dependencies

If you did not clone the repository using the `--recursive-submodules` option, make sure to install the submodules with

```bash
git submodule update --init --recursive   # in the balancer-pool-metadata directory
```

```bash
pnpm install
```

## Running tests

```bash
pnpm test
```

## Deploy to local network

We are using [anvil](https://book.getfoundry.sh/anvil/) to create a local testnet node for deploying and testing contracts. Run the anvil server, get a generated private key in the terminal, and change your `PRIVATE_KEY` in the `.env` file. Then deploy with `deploy:local`.

```bash
pnpm dev:anvil
pnpm deploy:local
```

## Deploy to Goerli testnet

```bash
pnpm deploy:goerli
```
