import { FormPageWrapper } from "#/components/FormPageWrapper";
import { fetchAmmData } from "#/lib/fetchAmmData";

import { EditAMMForm } from "../(components)/EditAMMForm";

export default async function Page({
  params,
}: {
  params: { userId: string; id: `0x${string}` };
}) {
  const ammData = await fetchAmmData(params.id);

  return (
    <FormPageWrapper
      formTitle="Manage AMM"
      backHref={`/${params.userId}/amms/${params.id}`}
    >
      <EditAMMForm cowAmmData={ammData} submitButtonText="Edit AMM" />
    </FormPageWrapper>
  );
}
