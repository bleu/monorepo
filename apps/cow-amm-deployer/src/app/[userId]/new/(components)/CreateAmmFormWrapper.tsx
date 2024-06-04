import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { LinkComponent } from "#/components/Link";

import { CreateAMMForm } from "./CreateAMMForm";

function ArrowIcon() {
  return (
    <ArrowLeftIcon
      height={16}
      width={16}
      className="text-background duration-200 hover:text-highlight"
    />
  );
}

export function CreateAMMFormWrapper({ userId }: { userId: string }) {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="my-4 flex flex-col border-2 border-foreground bg-card border-card-foreground text-card-foreground">
        <div className="relative flex size-full justify-center">
          <LinkComponent
            href={`/${userId}/amms`}
            content={
              <div className="absolute left-8 flex h-full items-center">
                <ArrowIcon />
              </div>
            }
          />
          <div className="flex w-[530px] flex-col items-center py-3">
            <div className="text-xl">Create AMM</div>
          </div>
        </div>
        <div className="flex flex-col w-[530px] overflow-auto size-full max-h-[550px] p-5">
          <CreateAMMForm userId={userId} />
        </div>
      </div>
    </div>
  );
}
