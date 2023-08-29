import { redirect } from "next/navigation";

import { Round } from "#/app/apr/(utils)/rounds";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string> | undefined;
}) {
  const search = new URLSearchParams(searchParams);
  return redirect(
    `/apr/round/${Round.currentRound().value}?${search.toString()}`,
  );
}
