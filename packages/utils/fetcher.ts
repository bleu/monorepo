export async function fetcher<JSON = unknown>(
  input: RequestInfo,
  init?: RequestInit,
): Promise<JSON> {
  let response: Response;

  try {
    response = await fetch(input, init);
  } catch (error) {
    throw new Error(`Network error while fetching ${input}: ${error}`);
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(`Rate limit exceeded when fetching ${input}`);
    }

    let responseBody;
    let errorMessage = `Network response was not ok when fetching ${input}. Status Code: ${response.status}. `;

    try {
      // Read the response body as text first
      responseBody = await response.text();

      // Try to parse as JSON if possible
      try {
        const jsonBody = JSON.parse(responseBody);
        errorMessage +=
          // @ts-expect-error
          jsonBody.details?.map((e: unknown) => e.message).join(", ") ||
          JSON.stringify(jsonBody);
      } catch {
        // Use text if JSON parsing fails
        errorMessage += responseBody;
      }
    } catch {
      throw new Error(`Error reading response body from ${input}`);
    }

    throw new Error(errorMessage);
  }

  try {
    // Now response.json() won't be called if response.text() has already been called
    return JSON.parse(await response.text());
  } catch (error) {
    throw new Error(`Error parsing JSON from ${input}: ${error}`);
  }
}
