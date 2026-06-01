// my-app/utils/api.ts

// Arahkan BASE_URL ke proxy internal Next.js lokal kita sendiri
export const BASE_URL = "/api";

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // Ambil token secara dinamis dari localStorage (aman dijalankan di client-side)
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Merapikan endpoint agar tidak terjadi double slash (//)
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${BASE_URL}${cleanEndpoint}`;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Error HTTP: ${res.status}`);
  }

  return res.json();
}