"use client";

import { useState } from "react";
import Link from "next/link";
// 1. IMPORT fungsi dari file auth kamu di sini
import { saveSession, getDashboardPath } from "@/lib/auth"; // Sesuaikan path jika file auth.ts kamu ada di utils/auth

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Tembak ke API lokal Next.js (Proxy)
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Username atau password salah");
      }

      const { accessToken, role, id, username } = result.data;

      // ==========================================
      // 👇 INI BAGIAN YANG SAYA UBAH & PERBAIKI 👇
      // ==========================================

      // 2. Format datanya jadi satu objek utuh agar dibaca benar oleh LayoutWrapper
      const userData = {
        id: id,
        username: username || formData.username,
        role: role,
        token: accessToken, 
      };

      // 3. Simpan pakai saveSession, BUKAN localStorage.setItem manual lagi!
      saveSession(userData);

      // 4. Redirect pakai fungsi getDashboardPath agar rutenya pasti benar
      window.location.href = getDashboardPath(role);

      // ==========================================
      // 👆 BATAS BAGIAN YANG DIUBAH 👆
      // ==========================================

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Selamat Datang</h2>
          <p className="text-sm text-gray-500 mt-1">Silakan masuk ke akun Cafe POS Anda</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-amber-500 focus:ring-amber-500"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-amber-500 focus:ring-amber-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-700 p-3 font-semibold text-white hover:bg-amber-800 transition disabled:bg-gray-400"
          >
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="font-medium text-amber-700 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}