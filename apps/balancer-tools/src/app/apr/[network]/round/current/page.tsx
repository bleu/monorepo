import { redirect } from "next/navigation";

import { Round } from "#/app/apr/(utils)/rounds";

export default function Page() {
  redirect(`/apr/ethereum/round/${Round.getAllRounds()[0].value}`);
}
