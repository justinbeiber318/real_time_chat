const API_URL = "http://localhost:4000";

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with ${response.status}`);
  }

  return data as T;
}