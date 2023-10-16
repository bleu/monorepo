export async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, init);
  const responseJson = await response.json();

  if (!response.ok) {
    const errorMessage =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      responseJson.details?.map((e: any) => e.message).join(", ") ||
      `Network response was not ok when fetching ${input}`;
    throw new Error(errorMessage);
  }
  if (responseJson.error || responseJson.errors) {
    const errorMessage = responseJson.errors
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        responseJson.errors.map((e: any) => e.message).join(", ")
      : responseJson.error.message || "GraphQL error occurred";
    throw new Error(errorMessage);
  }

  return response.json();
}
