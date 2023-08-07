import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(_request: NextRequest) {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  return new Response("Hello, Next.js!", {
    status: 200,
    headers: { "Set-Cookie": `token=${token}` },
  });
}
