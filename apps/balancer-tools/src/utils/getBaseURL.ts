import "server-only";

import { headers } from "next/headers";

export default function getBaseURL() {
  const headersList = headers();
  const host = headersList.get("host") || "localhost:3000";
  const protocol = headersList.get("x-forwarded-proto") || "http";

  return `${protocol}://${host}`;
}
