/* eslint-disable no-console */
import { gql } from "./gql";
import { BATCH_SIZE, logIfVerbose } from "./index";

export async function paginate<T>(
  initialId: string,
  step: number,
  fetchFn: (id: string) => Promise<T | null>,
): Promise<void> {
  logIfVerbose(`Paginating from initialId=${initialId}, step=${step}`);

  let idValue = initialId;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const data = await fetchFn(idValue);

    if (!data) {
      break;
    }

    // @ts-ignore  this comes as unknown type, but it is an array
    const dataArray = Object.values(data)[0];

    // @ts-ignore  this comes as unknown type, but it is an array
    if (dataArray.length < BATCH_SIZE) {
      break;
    }
    // @ts-ignore  this comes as unknown type, but it is an array
    idValue = dataArray[dataArray.length - 1].id;
    console.log(idValue);
  }
}

type ProcessFn<T> = (data: T) => Promise<void>;

export async function paginatedFetch<T>(
  networkEndpoint: string,
  query: string,
  processFn: ProcessFn<T>,
  initialId = "",
  step = BATCH_SIZE,
  variables = {},
): Promise<void> {
  await paginate(initialId, step, async (latestId: string) => {
    const response = await gql(networkEndpoint, query, {
      latestId,
      ...variables,
    });
    if (response.data) {
      logIfVerbose({ response });
      await processFn(response.data);
      return response.data;
    }

    if (response.errors) {
      console.error(
        `Failed to fetch data from ${networkEndpoint}, ${query}, ${latestId}`,
      );
      console.error({ variables });
      console.error(response.errors);
      throw new Error("Failed to fetch data");
    }

    return null;
  });
}

export async function paginatedFetchDateRange<T>(
  networkEndpoint: string,
  query: string,
  fromDate: number,
  processFn: ProcessFn<T>,
  initialId = "",
  step = BATCH_SIZE,
): Promise<void> {
  await paginate(initialId, step, async (latestId: string) => {
    const response = await gql(networkEndpoint, query, { latestId, fromDate });
    if (response.data) {
      await processFn(response.data);
      return response.data;
    }

    return null;
  });
}
