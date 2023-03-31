import { Chain } from "wagmi";

import { ActionAttribute } from "#/contexts/AdminToolsContext";
import gaugeGql from "#/lib/gaugesGql";
import poolGql from "#/lib/gql";

const inputField =  {
  label: "Pool ID",
  key: "poolId",
  placeholder: "Insert the Pool ID here",
  type: "string",
  getValidations: ( chain:
    | (Chain & {
        unsupported?: boolean | undefined;
      })
    | undefined) => ({
    poolExists: async (value: string) => {
      if(!value) return ""
      const result = await poolGql(
        chain!.id.toString()
      ).Pool({
        poolId: value,
      });

      return !result.pool?.symbol ? "Pool not found. Please insert an existing Pool ID" : "";
    },
  }),
}

const gaugeField = {
  label: "Gauge ID",
  key: "gaugeId",
  placeholder: "Insert the Gauge ID here",
  type: "string",
  getValidations: ( chain:
    | (Chain & {
        unsupported?: boolean | undefined;
      })
    | undefined) => ({
    gaugeExists: async (value: string) => {
      if(!value) return ""
      const result = await gaugeGql(
        chain!.id.toString()
      ).Gauge({
        gaugeId: value,
      });

      return !result.liquidityGauge?.symbol ? "Gauge not found. Please insert an existing Gauge ID" : "";
    },
  }),
}


export const hardcodedData:{actions: ActionAttribute[]} = {
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
        inputField,
        gaugeField,
      {
        label: "Amount",
        placeholder: "Insert the amount",
        type: "number",
        key: "amount"
      }
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
          type: "string",
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
          type: "string",
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
          type: "string",
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
          type: "string",
        },
        inputField,
      ],
    },
  ],
};


// name: "Set Pool Amp Factor",
// name: "Allowlist Pool Gauge",
// name: "Set Pool Swap Fee",
// name: "Kill Unkill Pool Gauge",