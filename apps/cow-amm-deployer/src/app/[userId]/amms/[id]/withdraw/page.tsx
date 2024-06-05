import { FormPageWrapper } from "#/components/FormPageWrapper";
import { fetchAmmData } from "#/lib/fetchAmmData";

import { WithdrawForm } from "./(components)/WithdrawForm";

export default async function Page({
  params,
}: {
  params: { userId: string; id: `0x${string}` };
}) {
  const ammData = await fetchAmmData(params.id);

  return (
    <FormPageWrapper
      formTitle="Proportional Withdraw"
      backHref={`/${params.userId}/amms/${params.id}`}
    >
      <WithdrawForm cowAmm={ammData} userId={params.userId} />
    </FormPageWrapper>
  );
}
