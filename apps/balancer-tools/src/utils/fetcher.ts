export async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, init);

  if (!response.ok) {
    // eslint-disable-next-line no-console
    console.error(await response.text());
    throw new Error("Network response was not ok");
  }

  return response.json();
}
