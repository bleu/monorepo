import { Suspense } from "react";

import { Spinner } from "#/components/Spinner";

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
}: {
  title: string;
  content: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <KPICardWrapper>
          <Spinner size="sm" />
        </KPICardWrapper>
      }
    >
      <KPICardWrapper>
        <div className="font-semibold">{title}</div>
        <div className="pt-2">{content}</div>
      </KPICardWrapper>
    </Suspense>
  );
}
