import Image from "next/image";

export default function WalletNotConnected() {
  return (
    <div className="flex w-full flex-col items-center rounded-3xl px-12 py-16 md:py-20">
      <div className="text-center text-3xl text-amber9">
        Please connect your wallet
      </div>
      <Image
        src={"/assets/connect-wallet.svg"}
        height={500}
        width={500}
        alt=""
      />
    </div>
  );
}
