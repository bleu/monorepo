import { redirect } from "next/navigation";

import { Round } from "#/app/apr/(utils)/rounds";

export default function Page() {
  redirect(Round.getAllRounds()[0].value);
}
