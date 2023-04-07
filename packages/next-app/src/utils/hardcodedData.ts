import { ActionAttribute } from "#/contexts/AdminToolsContext";
import { gauges, pools } from "#/lib/gql";
import { Chain } from "#/wagmi";

const poolField = {
  label: "Pool ID",
  key: "poolId",
  placeholder: "Insert the Pool ID here",
  getValidations: (chain?: Chain) => ({
    poolExists: async (value: string) => {
      if (!value) return "";
      const result = await pools.gql(chain!.id.toString()).Pool({
        poolId: value,
      });

      return !result.pool?.symbol
        ? "Pool not found. Please insert an existing Pool ID"
        : "";
    },
  }),
};

const gaugeField = {
  label: "Gauge ID",
  key: "gaugeId",
  placeholder: "Insert the Gauge ID here",
  getValidations: (chain?: Chain) => ({
    gaugeExists: async (value: string) => {
      if (!value) return "";
      const result = await gauges.gql(chain!.id.toString()).Gauge({
        gaugeId: value,
      });

      return !result.liquidityGauge?.symbol
        ? "Gauge not found. Please insert an existing Gauge ID"
        : "";
    },
  }),
};

export const hardcodedData: { actions: ActionAttribute[] } = {
  actions: [
    {
      id: 1,
      name: "Add Reward Tokens",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id iaculis ante. Sed cursus arcu sapien, nec ornare lacus ullamcorper sed. Maecenas ullamcorper ligula ut ex varius consequat. Donec dictum commodo arcu finibus accumsan. Aliquam quis orci pretium tellus ornare lobortis.",
      operationResponsible: "Maxis",
      contractAddress: "0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B",
      contractUrl:
        "https://etherscan.io/address/0xba100000625a3754423978a60c9317c58a424e3d",
      fields: [
        poolField,
        gaugeField,
        {
          label: "Amount",
          placeholder: "Insert the amount",
          key: "amount",
        },
      ],
    },
    {
      id: 2,
      name: "Set Pool Amp Factor",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id iaculis ante. Sed cursus arcu sapien, nec ornare lacus ullamcorper sed. Maecenas ullamcorper ligula ut ex varius consequat. Donec dictum commodo arcu finibus accumsan. Aliquam quis orci pretium tellus ornare lobortis.",
      operationResponsible: "Labs",
      contractAddress: "0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B",
      contractUrl:
        "https://etherscan.io/address/0xba100000625a3754423978a60c9317c58a424e3d",
      fields: [
        {
          label: "Name",
          key: "name",
          placeholder: "Insert your name here",
        },
      ],
    },
    {
      id: 3,
      name: "Allowlist Pool Gauge",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id iaculis ante. Sed cursus arcu sapien, nec ornare lacus ullamcorper sed. Maecenas ullamcorper ligula ut ex varius consequat. Donec dictum commodo arcu finibus accumsan. Aliquam quis orci pretium tellus ornare lobortis.",
      operationResponsible: "Maxis",
      contractAddress: "0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B",
      contractUrl:
        "https://etherscan.io/address/0xba100000625a3754423978a60c9317c58a424e3d",
      fields: [
        {
          label: "Name",
          key: "name",
          placeholder: "Insert your name here",
        },
      ],
    },
    {
      id: 4,
      name: "Set Pool Swap Fee",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id iaculis ante. Sed cursus arcu sapien, nec ornare lacus ullamcorper sed. Maecenas ullamcorper ligula ut ex varius consequat. Donec dictum commodo arcu finibus accumsan. Aliquam quis orci pretium tellus ornare lobortis.",
      operationResponsible: "Maxis",
      contractAddress: "0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B",
      contractUrl:
        "https://etherscan.io/address/0xba100000625a3754423978a60c9317c58a424e3d",
      fields: [
        {
          label: "Name",
          key: "name",
          placeholder: "Insert your name here",
        },
      ],
    },
    {
      id: 5,
      name: "Kill Unkill Pool Gauge",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id iaculis ante. Sed cursus arcu sapien, nec ornare lacus ullamcorper sed. Maecenas ullamcorper ligula ut ex varius consequat. Donec dictum commodo arcu finibus accumsan. Aliquam quis orci pretium tellus ornare lobortis.",
      operationResponsible: "Maxis",
      contractAddress: "0xBA1BA1ba1BA1bA1bA1Ba1BA1ba1BA1bA1ba1ba1B",
      contractUrl:
        "https://etherscan.io/address/0xba100000625a3754423978a60c9317c58a424e3d",
      fields: [
        {
          label: "Name",
          key: "name",
          placeholder: "Insert your name here",
        },
        poolField,
      ],
    },
  ],
};
