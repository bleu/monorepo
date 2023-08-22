import { redirect } from "next/navigation";

import { Round } from "#/app/apr/(utils)/rounds";

export default function Page({
  params,
}: {
  params: { network: string; poolId: string };
}) {
  redirect(
    `/apr/${params.network}/pool/${params.poolId}/round/${
      Round.getAllRounds()[0].value
    }`,
  );
}
