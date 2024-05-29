import { SECONDS_IN_DAY } from "@bleu/utils/date";
import { redirect } from "next/navigation";

import { generatePoolPageLink } from "../../(utils)/getFilteredUrl";
import { QueryParamsPagesSchema } from "../../(utils)/validate";
import { SearchParams } from "../../page";

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  const parsedParams = QueryParamsPagesSchema.safeParse(searchParams);
  let startAtDate;
  let endAtDate;
  if (!parsedParams.success) {
    startAtDate = new Date();
    endAtDate = new Date(new Date().getTime() - 3 * SECONDS_IN_DAY * 1000);
  } else {
    startAtDate = parsedParams.data.startAt;
    endAtDate = parsedParams.data.endAt;
  }

  return redirect(
    generatePoolPageLink(startAtDate as Date, endAtDate as Date, searchParams),
  );
}
