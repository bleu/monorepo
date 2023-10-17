export const maxDuration = 300;

export async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, init);

  if (!response.ok) {
    const errorBody = await response.json();
    const errorMessage =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      errorBody.details?.map((e: any) => e.message).join(", ") ||
      `Network response was not ok when fetching ${input}`;
    throw new Error(errorMessage);
  }

  return response.json();
}
