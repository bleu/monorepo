import { Badge, Button, Stack, Text } from "@chakra-ui/react";

interface IPoolItem {
  onClick: () => void;
  address: string;
  type: string;
  ratio?: string;
  name: string;
  isSelected: boolean;
}

export function OwnedPool({
  onClick,
  address,
  type,
  ratio,
  name,
  isSelected,
}: IPoolItem) {
  const backgroundColor = isSelected ? "blue.800" : "gray.800";

  return (
    <Button
      p="0"
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
      <Stack
        w="full"
        h="full"
        p="2.5"
        direction="row"
        justify="flex-start"
        align="center"
      >
        <Stack justify="flex-start" align="flex-start" spacing="4px" flex="1">
          <Stack
            direction="row"
            justify="flex-start"
            align="center"
            alignSelf="stretch"
          >
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
              {name}
            </Text>
            {ratio && (
              <Badge
                p="1px"
                colorScheme="blue"
                _groupHover={{ background: "yellow.100" }}
                background={isSelected ? "yellow.100" : "blue.200"}
              >
                {ratio}
              </Badge>
            )}
          </Stack>
          <Stack
            direction="row"
            justify="flex-start"
            align="center"
            spacing="16px"
            alignSelf="stretch"
          >
            <Stack
              direction="row"
              justify="flex-start"
              align="flex-start"
              spacing="0px"
            >
              <Badge
                p="1"
                variant="outline"
                _groupHover={{
                  color: "gray.400",
                }}
              >
                {type}
              </Badge>
            </Stack>
            <Stack
              direction="row"
              justify="flex-start"
              align="center"
              spacing="1"
            >
              <Text
                fontFamily="Inter"
                lineHeight="1.2"
                fontWeight="regular"
                fontSize="0.75rem"
                color="gray.600"
                _groupHover={{
                  color: "gray.400",
                }}
              >
                {address}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Button>
  );
}
