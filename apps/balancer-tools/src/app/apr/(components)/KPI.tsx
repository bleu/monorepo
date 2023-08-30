import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Suspense } from "react";

import { Spinner } from "#/components/Spinner";
import { Tooltip } from "#/components/Tooltip";

function KPICardWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex grow flex-col bg-blue6 rounded py-3 px-4 2xl:py-6 2xl:px-8 items-center justify-evenly text-center">
      {children}
    </div>
  );
}

export function KPI({
  title,
  content,
  tooltip,
}: {
  title: string;
  content: React.ReactNode;
  tooltip?: string;
}) {
  return (
    <KPICardWrapper>
      <Suspense fallback={<Spinner size="sm" />}>
        <div className="font-semibold flex items-center gap-x-1">
          {title}
          {tooltip && (
            <Tooltip content={tooltip}>
              <InfoCircledIcon />
            </Tooltip>
          )}
        </div>
        <div className="pt-2">{content}</div>
      </Suspense>
    </KPICardWrapper>
  );
}
