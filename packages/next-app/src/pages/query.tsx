import { Header } from "../components";
import gql from "../lib/gql";

function Page() {
  const { data, isLoading, error } = gql.usePool({
    owner: "0xb5Ca2B02b89b4912Ae67317209Bb59EfAb401867",
  });

  return (
    <>
      <Header />
      <span>{isLoading ? "loading" : ""}</span>
      <span>{error ? "errors" + JSON.stringify(error) : ""}</span>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </>
  );
}

export default Page;
