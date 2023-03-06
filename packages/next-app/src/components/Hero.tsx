import { Flex, Heading } from "@chakra-ui/react";

import { Header } from "./Header";

export function Hero() {
  return (
    <>
      <Header />
      <Flex h="100vh" align="center" justify="center" background="gray.900">
        <Heading
          as="h1"
          size="xl"
          color="white"
          opacity="0.8"
          fontWeight="normal"
          lineHeight={1.5}
          textAlign="center"
        >
          Welcome to Balancer Pool Metadata, please connect your wallet
        </Heading>
      </Flex>
    </>
  );
}
