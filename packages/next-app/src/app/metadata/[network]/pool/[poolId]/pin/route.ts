import { NextResponse } from "next/server";

const pin = async (json: Record<string, string>) => {
  const formData = new FormData();

  formData.append(
    "file",
    new Blob([JSON.stringify(json)], {
      type: "application/json",
    }),
    "metadata.json",
  );

  const projectId = process.env.INFURA_IPFS_PROJECT_ID;
  const projectSecret = process.env.INFURA_IPFS_PROJECT_SECRET;

  return await fetch("https://ipfs.infura.io:5001/api/v0/add?quieter=true", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${projectId}:${projectSecret}`,
      ).toString("base64")}`,
    },
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => res.Hash as string);
};

export async function POST(req: Request) {
  const { metadata } = await req.json();

  const pinned = await pin(metadata);
  return NextResponse.json(pinned);
}
