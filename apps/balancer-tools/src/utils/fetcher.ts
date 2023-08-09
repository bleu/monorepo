export async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  const response = await fetch(input, init);

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}
