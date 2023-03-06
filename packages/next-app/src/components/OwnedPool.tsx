import { Badge, Button, HStack, Text, VStack } from "@chakra-ui/react";

interface IOwnedPool {
  onClick: () => void;
  address?: string;
  poolType?: string | null | undefined;
  name?: string | null | undefined;
  id?: string | null | undefined;
  tokens?:
    | {
        symbol: string;
        weight?: unknown;
      }[]
    | null
    | undefined;
  isSelected: boolean;
}

function truncateAddress(address: string | undefined) {
  if (!address) return;
  const match = address.match(
    /^(0x[a-zA-Z0-9]{10})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/
  );
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}

export function OwnedPool({
  onClick,
  address,
  poolType,
  name,
  isSelected,
  tokens,
}: IOwnedPool) {
  const backgroundColor = isSelected ? "blue.800" : "gray.800";

  const poolName =
    poolType === "Weighted" ? tokens!.map((obj) => obj.symbol).join("/") : name;
  const weights =
    poolType === "Weighted"
      ? tokens!.map((obj) => Number(obj.weight) * 100).join("/")
      : null;

  return (
    <Button
      p="2"
      h="20"
      w="full"
      background={backgroundColor}
      alignSelf="stretch"
      role="group"
      _hover={{
        background: "blue.800",
        borderRadius: 0,
      }}
      color={backgroundColor}
      onClick={onClick}
    >
      <VStack spacing="1" w={"full"}>
        <HStack alignSelf="stretch">
          <Text
            fontFamily="Inter"
            lineHeight="1.5"
            fontWeight="bold"
            fontSize="1rem"
            color="gray.200"
            _groupHover={{
              color: "yellow.400",
            }}
          >
            {poolName}
          </Text>
          {weights && (
            <Badge
              p="2px"
              colorScheme="blue"
              _groupHover={{ background: "yellow.100" }}
              background={isSelected ? "yellow.100" : "blue.200"}
            >
              {weights}
            </Badge>
          )}
        </HStack>
        <HStack spacing={3} w={"full"}>
          <Badge
            p="1"
            variant="outline"
            _groupHover={{
              color: "gray.400",
            }}
          >
            {poolType}
          </Badge>
          <Text
            fontFamily="Inter"
            lineHeight="1.2"
            fontSize="0.75rem"
            color="gray.500"
            _groupHover={{
              color: "gray.400",
            }}
          >
            {truncateAddress(address)}
          </Text>
        </HStack>
      </VStack>
    </Button>
  );
}
