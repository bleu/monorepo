import { ArrowLeftIcon } from "@radix-ui/react-icons";

import { LinkComponent } from "#/components/Link";

function ArrowIcon() {
  return (
    <ArrowLeftIcon
      height={16}
      width={16}
      className="text-background duration-200 hover:text-highlight"
    />
  );
}

export function FormPageWrapper({
  children,
  backHref,
  formTitle,
}: {
  children: React.ReactNode;
  backHref: string;
  formTitle: string;
}) {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="my-4 flex flex-col border-2 border-foreground bg-card border-card-foreground text-card-foreground">
        <div className="relative flex size-full justify-center">
          <LinkComponent
            href={backHref}
            className="absolute left-8 flex h-full items-center"
          >
            <ArrowIcon />
          </LinkComponent>
          <div className="flex w-[530px] flex-col items-center pt-3">
            <div className="text-xl">{formTitle}</div>
          </div>
        </div>
        <div className="flex flex-col w-[530px] overflow-auto size-full max-h-[550px] px-5 pb-5 pt-2">
          {children}
        </div>
      </div>
    </div>
  );
}
