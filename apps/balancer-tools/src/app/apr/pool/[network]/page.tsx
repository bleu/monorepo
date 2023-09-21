import { redirect } from "next/navigation";

export default function Page({
  params: { network },
}: {
  params: { network: string };
}) {
  return redirect(`/apr/?network=${network}`);
}
