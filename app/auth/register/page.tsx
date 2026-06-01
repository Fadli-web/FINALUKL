"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "CUSTOMER", // default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Menembak rute lokal Next.js yang barusan kita buat
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();

      if (!res.ok) {
         throw new Error(result.message || "Gagal melakukan registrasi");
      }

      alert("Registrasi berhasil! Silakan login.");
      router.push("/auth/login");
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
          <h2 className="text-3xl font-bold text-gray-800">Buat Akun Cafe</h2>
          <p className="text-sm text-gray-500 mt-1">Daftar sebagai Customer, Kasir, atau Manajer</p>
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Pilih Role</label>
            <select
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-amber-500 focus:ring-amber-500"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="CUSTOMER">Customer (Pelanggan)</option>
              <option value="CASHIER">Cashier (Kasir)</option>
              <option value="MANAGER">Manager (Manajer)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-700 p-3 font-semibold text-white hover:bg-amber-800 transition disabled:bg-gray-400"
          >
            {loading ? "Mendaftar..." : "Daftar Sekarang"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="font-medium text-amber-700 hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}