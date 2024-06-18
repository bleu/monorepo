import { networkFor } from "@bleu/utils";
// @ts-expect-error
import parsePrometeusText from "parse-prometheus-text-format";
import useSWR from "swr";

import { NEXT_PUBLIC_API_URL } from "#/lib/ponderApi";

function getBlockNumberFromPrometheusMetrics(
  rawMetricsData: string,
  chainId: number,
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const metrics = parsePrometeusText(rawMetricsData) as Record<string, any>;

  const latestBlockNumber = Object.values(metrics)
    .find(({ name }) => name === "ponder_realtime_latest_block_number")
    ?.["metrics"]?.find(
      // @ts-expect-error
      ({ labels }) => labels.network === networkFor(chainId),
    )?.value;

  if (!latestBlockNumber) return undefined;

  return Number(latestBlockNumber);
}

function useAPIPrometheusMetricsBlockNumber(chainId?: number) {
  const metricsUrl = NEXT_PUBLIC_API_URL + "/metrics";
  const { data, isLoading, mutate } = useSWR(metricsUrl, (url: string) =>
    fetch(url).then((res) => res.text()),
  );

  if (!data || !chainId) return { data: undefined, isLoading, mutate };

  const latestBlockNumber = getBlockNumberFromPrometheusMetrics(data, chainId);

  return { data: latestBlockNumber, isLoading, mutate };
}

export function useIsPonderAPIAtBlockNumber(
  chainId?: number,
  blockNumber?: bigint,
) {
  const {
    data: latestBlockNumber,
    isLoading,
    mutate,
  } = useAPIPrometheusMetricsBlockNumber(chainId);

  if (!chainId || !blockNumber)
    return { isPonderAPIAtBlockNumber: false, isLoading, mutate };

  return {
    isPonderAPIAtBlockNumber:
      latestBlockNumber !== undefined &&
      latestBlockNumber >= Number(blockNumber),
    isLoading,
    mutate,
  };
}
