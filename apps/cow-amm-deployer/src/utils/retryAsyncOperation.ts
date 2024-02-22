export const retryAsyncOperation = async <T>(
  operation: () => Promise<T>,
  maxRetries: number,
  delay: number,
): Promise<T | null> => {
  let attempts = 0;
  while (attempts < maxRetries) {
    try {
      return await operation();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return null;
};
