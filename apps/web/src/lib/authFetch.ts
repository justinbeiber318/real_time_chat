export const API_URL = "http://localhost:4000";

export async function authFetch<T>(
  path: string,
  token: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  const text = await response.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    console.error("API did not return JSON");
    console.error("URL:", `${API_URL}${path}`);
    console.error("Status:", response.status);
    console.error("Response text:", text);

    throw new Error("API did not return JSON. Check backend URL or route.");
  }

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with ${response.status}`);
  }

  return data as T;
}