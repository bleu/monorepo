import { SearchParams } from "../round/[roundId]/page";

export const MIN_TVL = 1000;

function getFilterDataFromParams(searchParams: SearchParams) {
  const minTVL = searchParams["minTVL"];
  const maxTVL = searchParams["maxTVL"];
  const minAPR = searchParams["minAPR"];
  const maxAPR = searchParams["maxAPR"];
  const tokens = searchParams["tokens"] ?? null;
  const type = searchParams["type"] ?? null;
  const network = searchParams["network"] ?? null;

  return {
    minTVL: minTVL ? Number(minTVL) : MIN_TVL,
    maxTVL: maxTVL ? Number(maxTVL) : undefined,
    minAPR: minAPR ? Number(minAPR) : undefined,
    maxAPR: maxAPR ? Number(maxAPR) : undefined,
    tokens: tokens ? tokens.split("_") : undefined,
    type: type ? type.split("_") : undefined,
    network: network ? network.split("_") : undefined,
  };
}

export default function getFilteredApiUrl(searchParams: SearchParams) {
  const fileredData = getFilterDataFromParams(searchParams);

  const minTVL = fileredData.minTVL ? `&minTVL=${fileredData.minTVL}` : "";
  const maxTVL = fileredData.maxTVL ? `&maxTVL=${fileredData.maxTVL}` : "";
  const minAPR = fileredData.minAPR ? `&minAPR=${fileredData.minAPR}` : "";
  const maxAPR = fileredData.maxAPR ? `&maxAPR=${fileredData.maxAPR}` : "";
  const tokens = fileredData.tokens ? `&tokens=${fileredData.tokens}` : "";
  const type = fileredData.type ? `&type=${fileredData.type}` : "";
  const network = fileredData.network ? `&network=${fileredData.network}` : "";

  return `${process.env.NEXT_PUBLIC_SITE_URL}/apr/api/?sort=apr&limit=10&order=desc${minTVL}${maxTVL}${minAPR}${maxAPR}${tokens}${type}${network}`;
}
