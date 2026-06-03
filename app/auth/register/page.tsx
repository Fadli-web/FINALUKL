"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSpring, animated } from "@react-spring/web"; // Animasi React Spring

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "CUSTOMER", // default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // --- ANIMASI REACT SPRING ---
  // Animasi form melayang (slide up + fade in)
  const fadeUpForm = useSpring({
    from: { opacity: 0, transform: "translateY(50px) scale(0.95)" },
    to: { opacity: 1, transform: "translateY(0px) scale(1)" },
    config: { tension: 250, friction: 25 },
  });

  // Animasi text header
  const fadeText = useSpring({
    from: { opacity: 0, y: -20 },
    to: { opacity: 1, y: 0 },
    delay: 300,
    config: { tension: 200, friction: 20 },
  });

  // --- LOGIKA ASLI (TIDAK DIUBAH SAMA SEKALI) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Menembak rute lokal Next.js
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const result = await res.json();

      if (!res.ok) {
         throw new Error(result.message || "Gagal melakukan registrasi");
      }

      // Animasi alert bisa diganti toast custom kedepannya, untuk sekarang pakai bawaan
      alert("Registrasi berhasil! Silakan login.");
      router.push("/auth/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 1. CONTAINER UTAMA DENGAN BACKGROUND IMAGE
    // Pastikan '/coffe2.jpg' ada di folder public kamu (sama seperti halaman Login)
    <div 
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center font-sans selection:bg-amber-500/30 selection:text-white px-4 py-8"
      style={{ backgroundImage: "url('/backgroundregister.jpg')" }} 
    >
      {/* 2. OVERLAY GELAP */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] z-0" />

      {/* Decorative Glow di belakang form */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/20 blur-[120px] rounded-full pointer-events-none z-0" />

      {/* 3. CARD REGISTER (GLASSMORPHISM) */}
      <animated.div 
        style={fadeUpForm} 
        className="w-full max-w-md relative z-10 p-8 sm:p-10 rounded-[2rem] bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl my-auto"
      >
        <animated.div style={fadeText} className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/30 text-amber-500 font-mono font-black text-2xl mb-4 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
            🍵
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Buat Akun</h2>
          <p className="text-zinc-400 mt-2 text-sm font-medium">
            Daftar sebagai Customer, Kasir, atau Manajer
          </p>
        </animated.div>

        {/* Alert Error */}
        {error && (
          <div className="mb-6 rounded-xl bg-rose-500/20 backdrop-blur-md p-4 border border-rose-500/30 flex items-center gap-3 text-sm font-semibold text-rose-300">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Input Username */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400">Username</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                required
                placeholder="Masukkan username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full bg-black/30 border border-white/10 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-500 text-sm outline-none transition-all"
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-black/30 border border-white/10 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 rounded-xl pl-11 pr-4 py-3.5 text-white placeholder-zinc-500 text-sm outline-none transition-all tracking-widest"
              />
            </div>
          </div>

          {/* Input Role */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-zinc-400">Pilih Role</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <select
                className="w-full bg-black/30 border border-white/10 focus:border-amber-500/50 focus:ring-4 focus:ring-amber-500/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-sm outline-none transition-all appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="CUSTOMER" className="bg-zinc-900 text-white">Customer (Pelanggan)</option>
                <option value="CASHIER" className="bg-zinc-900 text-white">Cashier (Kasir)</option>
                <option value="MANAGER" className="bg-zinc-900 text-white">Manager (Manajer)</option>
              </select>
              {/* Custom dropdown arrow biar estetik di dark mode */}
              <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-zinc-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 disabled:opacity-50 text-black font-black py-4 rounded-xl text-sm transition-all hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] active:scale-[0.98]"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                <span className="tracking-wide">MENDAFTAR...</span>
              </>
            ) : (
              <span className="tracking-widest uppercase">Daftar Sekarang</span>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <p className="mt-8 text-center text-sm text-zinc-400 font-medium">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="text-amber-400 font-bold hover:text-amber-300 hover:underline transition-all">
            Login di sini
          </Link>
        </p>

      </animated.div>
    </div>
  );
}