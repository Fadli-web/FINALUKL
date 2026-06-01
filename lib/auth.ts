export interface UserData {
  id: number;
  username: string;
  role: "CUSTOMER" | "CASHIER" | "MANAGER";
  token: string;
}

const TOKEN_KEY = "token"; // 👑 Disamakan dengan api.ts kamu agar tidak bentrok!
const USER_KEY = "userData";

export function saveSession(data: any): void {
  if (typeof window === "undefined") return;
  
  // Ambil token & user secara fleksibel (mengantisipasi perbedaan format response backend)
  const token = data.token || data.accessToken || data.data?.token;
  const user = data.user || data.userData || data.data?.user || data;

  if (token) localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser(): any | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export function hasRole(allowedRoles: string | string[]): boolean {
  const user = getUser();
  if (!user) return false;
  
  const userRole = user.role || user.data?.role;
  if (!userRole) return false;

  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole);
  }
  return userRole === allowedRoles;
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case "MANAGER":
      return "/manager/dashboard";
    case "CASHIER":
      return "/cashier/dashboard";
    case "CUSTOMER":
    default:
      return "/customer/dashboard"; // ☕ Mengarah langsung ke dashboard customer
  }
}

export function logout(redirectPath = "/auth/login"): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.clear();
  window.location.replace(redirectPath);
}