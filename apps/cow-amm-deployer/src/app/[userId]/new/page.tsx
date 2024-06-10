"use client";

import { FormPageWrapper } from "#/components/FormPageWrapper";

import { CreateAMMForm } from "./(components)/CreateAMMForm";

export default function Page({ params }: { params: { userId: string } }) {
  return (
    <FormPageWrapper formTitle="New AMM" backHref={`/${params.userId}/amms`}>
      <CreateAMMForm userId={params.userId} />
    </FormPageWrapper>
  );
}
