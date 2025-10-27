import { getStoreValue } from "pulsy";

// Utility for API calls
export async function apiFetch(url, options = {}) {
  const authStore = getStoreValue('auth');

  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${String(authStore.token)}`,
    ...(options.headers || {})
  };
  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}