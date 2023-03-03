import { Stack, Text } from "@chakra-ui/react";
import { useState } from "react";

import { OwnedPool } from "./OwnedPool";

const pools = [
  {
    address: "0xe2f515d5e8...08c2",
    type: "WEIGHTED",
    ratio: "80/20",
    name: "USDC/SPHERE",
  },
  {
    address: "0xe2f51rrd5e8...08c2",
    type: "STABLE",
    name: "EGX/MSGLD",
  },
  {
    address: "0xe1515ewd5e8...08c2",
    type: "BOOSTED",
    ratio: "80/20",
    name: "Balancer Boosted Aave USD",
  },
  {
    address: "0xe3515d5e8...08c2",
    type: "COMPOSABLE STABLE",
    name: "TETU/USDC",
  },
];

export function Sidebar() {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);

  const handleButtonClick = (index: string | null) => {
    setSelectedPool(index === selectedPool ? null : index);
  };

  return (
    <Stack w="96" h="100%" maxWidth="100%" background="gray.900" p="5">
      <Stack
        justify="flex-start"
        align="flex-start"
        spacing="4"
        w="96"
        h="56rem"
        maxWidth="100%"
      >
        <Stack
          paddingX="2"
          justify="flex-start"
          align="flex-start"
          spacing="2.5"
          alignSelf="stretch"
          background="gray.900"
        >
          <Stack
            direction="row"
            justify="flex-start"
            align="flex-start"
            spacing="0px"
          >
            <Text
              fontFamily="Inter"
              lineHeight="1.2"
              fontWeight="medium"
              fontSize="2rem"
              color="gray.400"
            >
              Owned pools
            </Text>
          </Stack>
        </Stack>
        <Stack
          borderRadius="6px"
          justify="flex-start"
          align="flex-start"
          direction="column"
          spacing="0"
          maxHeight="40rem"
          borderColor="gray.700"
          borderStartWidth="1px"
          borderEndWidth="1px"
          borderTopWidth="1px"
          borderBottomWidth="1px"
          alignSelf="stretch"
          background="gray.800"
          position="relative"
          overflow="auto"
        >
          {pools &&
            pools.map((item) => (
              <OwnedPool
                key={item.address}
                onClick={() => handleButtonClick(item.address)}
                isSelected={item.address === selectedPool}
                {...item}
              />
            ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
