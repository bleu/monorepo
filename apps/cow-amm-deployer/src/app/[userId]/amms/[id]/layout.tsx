import { AmmDataContextProvider } from "#/contexts/ammData";

export default function Layout({
  children,
  params,
}: React.PropsWithChildren<{
  params: { userId: string; id: string };
}>) {
  return (
    <AmmDataContextProvider ammId={params.id}>
      {/* @ts-ignore */}
      {children}
    </AmmDataContextProvider>
  );
}
