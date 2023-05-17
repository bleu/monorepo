import Image from "next/image";

import SelectPoolImage from "#/assets/choose-pool.svg"; //TODO: Change image

export default function Page() {
  return (
    <div className="w-full rounded-3xl items-center py-16 px-12 md:py-20 flex flex-col">
      <div className="text-center text-amber9 text-3xl">
        CTA text here
      </div>
      <Image src={SelectPoolImage} height={400} width={400} alt="" />
    </div>
  );
}
