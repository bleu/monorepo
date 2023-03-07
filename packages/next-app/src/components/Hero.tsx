import { Header } from "./Header";

export function Hero() {
  return (
    <>
      <Header />
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <h1 className="text-center text-xl font-normal leading-6 text-white opacity-80 md:text-2xl md:leading-9">
          Welcome to Balancer Pool Metadata, please connect your wallet
        </h1>
      </div>
    </>
  );
}
