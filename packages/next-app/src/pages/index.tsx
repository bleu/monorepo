import { Stack } from "@chakra-ui/react";

import { Header, Sidebar } from "../components";

function Page() {
  return (
    <>
      <Header />
      <Stack h="100%" w="100%" background="gray.900">
        <Sidebar />
      </Stack>
    </>
  );
}

export default Page;
