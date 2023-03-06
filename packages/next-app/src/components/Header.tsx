import { Flex, Heading } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <Flex
      as="nav"
      align="center"
      justify="space-between"
      wrap="wrap"
      padding={4}
      bg="gray.800"
      color="white"
    >
      <Flex align="center" mr={5}>
        <Heading as="h1" size="md" letterSpacing={"tighter"}>
          Balancer Pool Metadata
        </Heading>
      </Flex>

      <ConnectButton />
    </Flex>
  );
}
