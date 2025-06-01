export function extractSearchParamsFromUrl(url: string): Record<string, string> {
  const queryString = url.split('?')[1];
  if (!queryString) return {};

  const params = new URLSearchParams(queryString);
  const result: Record<string, string> = {};

  params.forEach((value, key) => {
    result[key] = value;
  });

  return result;
}