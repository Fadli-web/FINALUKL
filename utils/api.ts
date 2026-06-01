// utils/api.ts atau lib/api.ts
export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  // WAJIB AMBIL DI DALAM FUNGSI biar token terbaru selalu terbaca saat ditransmisikan
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { "Authorization": `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Jika response backend tidak oke (401, 403, 500, dll)
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Error HTTP: ${res.status}`);
  }

  return res.json();
}