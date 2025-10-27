//hardcoded dev token for testing
const DEV_TOKEN = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZmYxN2RiNzVkMGUzM2ExN2UxNGE5ZiIsImlhdCI6MTc2MTU4ODQ1MSwiZXhwIjoxNzYxNTkyMDUxfQ.bxiDQ2OXFhc99zuPmB-yVxH0jGPQB8VInp64ADovnFI";

// Utility for API calls
export async function apiFetch(url, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": DEV_TOKEN,
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