# bleu's Monorepo

This repo serves as a hub for open-source projects, applications, and packages aimed at empowering DeFi users with enhanced functionalities, analytics, and ease of use. This repository encompasses tools and utilities to augment experiences across different protocols, including Balancer, CoW, and other integrated platforms.

## Avaliable tools

### Pool Metadata [🔗](https://tools.balancer.blue/metadata)

Enhance Balancer pools with metadata like pool name, symbol, description, and more, improving discoverability and user comprehension. The Balancer Pool Metadata tool provides a user-friendly interface for pool owners and a public Subgraph for developers to access this metadata.

### Internal Vault Balances Manager [🔗](https://tools.balancer.blue/internalbalances)

Empower users with a streamlined application to manage their internal balances. Deposit, withdraw, and transfer assets effortlessly, ensuring full control over digital assets.

### Pool Simulator (former Stable Swap Simulator) [🔗](https://tools.balancer.blue/poolsimulator)

A comprehensive tool for analyzing pool behaviors where you can compare different pool types. Set and modify pool parameters to evaluate key metrics like Swap, Price Impact, and Depth Cost. Simulate swaps and compare results with established data for Stable, Gyro and FX pools.

### APR [🔗](https://tools.balancer.blue/apr)

_👷👷👷 Under development 👷👷👷_

A visual guide to Balancer pools' historical APR.

### MilkmApp

_👷👷👷 Under development 👷👷👷_

A Safe App to interact to create milkman orders on CoW Protocol.

## Repository Structure

The project uses a monorepo structure. See the repo's [wiki](https://github.com/bleu/monorepo/wiki) to find more detail about each project structure.

## Pre-requisites

This project required Node. We suggest installing it using [asdf](https://asdf-vm.com/) if you don't use a Node version manager yet.

```bash
git clone https://github.com/asdf-vm/asdf.git ~/.asdf
```

and add binginds to your shell config file.

```bash
asdf plugin add nodejs
```

and run install node in the repo. This will pick up the current Node version from the [.tool-versions](/.tool-version) file.

```bash
asdf install nodejs
```

We use pnpm for package management. To install pnpm, run:

```bash
npm install -g pnpm
```

Install dependencies

```bash
pnpm i
```

If you need to build the Smart Contracts under the metadata app, you must first [install Foundry](https://book.getfoundry.sh/getting-started/installation) to your system:

```bash
curl -L https://foundry.paradigm.xyz | bash
source ~/.bashrc
foundryup
```

## Problems?

If you encounter any issues or need assistance:

1. Review our [wiki](https://github.com/bleu/monorepo/wiki)
2. Check [open issues](https://github.com/bleu/monorepo/issues) or create a new one.
3. Reach out to us at [balancer@bleu.studio](mailto:balancer@bleu.studio).

## Contributors

A heartfelt thanks to all who've contributed:

- **Nichollas Rennah** and **Marcos Tullyo**: Initial designs and development of for the metadata app.

Wish to be listed? Make a contribution and [open an issue](https://github.com/bleu/monorepo/issues/new) or send a pull request.

## Contributing

Contributions are warmly welcomed. Raise issues, propose PRs, or reach out directly to balancer@bleu.studio for discussions.

## License

The predominant license is the GNU General Public License Version 3 (GPL v3), referenced in [`LICENSE`](./LICENSE), barring explicit exceptions listed in this README or within the source files.

### Exceptions

<!-- TODO: Remember to identify and include the MIT licensed projects integrated into this repository. Note: Only projects where source code has been directly adopted require attribution. Look for MIT licensed projects that we copied to here and must be mentioned. This includes licenses from the math packages and Balancer/Gyro/FX, but excludes dependencies' own licenses unless we copied their source code. MIT licenses require to show attribution.-->

## Authors

@ribeirojose, @mendesfabio, @devjoaov, @luizakp, @yvesfracari

Heartily crafted by Bleu, with immense gratitude to the Balancer and CoW Grants committees for their financial endorsement.
