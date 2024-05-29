import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { LinkComponent } from "#/components/Link";
import { fetchAmmData } from "#/lib/fetchAmmData";

import { WithdrawForm } from "./(components)/WithdrawForm";

export default async function Page({
  params,
}: {
  params: { id: `0x${string}` };
}) {
  const ammData = await fetchAmmData(params.id);

  return (
    <div className="flex size-full items-center justify-center">
      <div className="my-4 flex flex-col border-2 bg-card text-card-foreground w-[530px] p-10">
        <div className="relative">
          <LinkComponent
            href={`/amms/${params.id}`}
            content={
              <ArrowLeftIcon
                height={16}
                width={16}
                className="text-background duration-200 hover:text-highlight absolute left-0 flex items-center"
              />
            }
          />
          <p className="text-xl text-center">Proportional withdraw</p>
        </div>
        <div className="pt-8">
          <WithdrawForm cowAmm={ammData} />
        </div>
      </div>
    </div>
  );
}
