import PinataSDK, { PinataPinResponse } from "@pinata/sdk";

export const pinata = new PinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_API_SECRET
);

export interface IPoolMetadata {
  name: string;
  type: string;
  desc: string;
  value: string;
}

export async function pinPoolMetadata(
  data: IPoolMetadata[]
): Promise<PinataPinResponse> {
  return await pinata.pinJSONToIPFS(data);
}
