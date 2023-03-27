import { ActionAttribute } from "#/contexts/AdminToolsContext";

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
        {
          name: "Pool ID",
          placeholder: "Insert the Pool ID here",
          type: "string",
        },
        {
          name: "Amount",
          placeholder: "Insert the amount",
          type: "number",
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
          name: "Name",
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
          name: "Name",
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
          name: "Name",
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
          name: "Name",
          placeholder: "Insert your name here",
          type: "string",
        },
        {
          name: "Pool ID",
          placeholder: "Insert the Pool ID here",
          type: "string",
        },
      ],
    },
  ],
};
