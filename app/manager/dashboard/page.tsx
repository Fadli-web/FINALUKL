"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";

interface StatCardProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  accent?: boolean;
  delay?: string;
}

function StatCard({ label, value, icon, accent, delay = "0ms" }: StatCardProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl ${
        accent
          ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-amber-500/20 shadow-xl"
          : "bg-white/[0.03] border border-white/[0.08] hover:border-amber-500/30 text-white"
      }`}
      style={{ animationDelay: delay }}
    >
      {/* Background glow */}
      {accent && (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent pointer-events-none" />
      )}
      <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 ${
        accent ? "bg-white/10" : "bg-amber-500/0 group-hover:bg-amber-500/5"
      }`} />

      <div className="relative flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className={`text-xs font-bold uppercase tracking-[0.15em] ${accent ? "text-amber-100" : "text-zinc-500"}`}>
            {label}
          </p>
          <p className={`text-5xl font-black tabular-nums tracking-tight ${accent ? "text-white" : "text-zinc-100"}`}>
            {value}
          </p>
        </div>
        <div className={`p-3 rounded-xl transition-all duration-300 ${
          accent
            ? "bg-white/20 text-white group-hover:bg-white/30"
            : "bg-white/[0.06] text-zinc-400 group-hover:bg-amber-500 group-hover:text-white"
        }`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

function ActivityRow({ label, sub, badge }: { label: string; sub: string; badge: string }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-white/[0.06] last:border-0">
      <div>
        <p className="text-sm font-semibold text-zinc-200">{label}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{sub}</p>
      </div>
      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
        {badge}
      </span>
    </div>
  );
}

export default function DashboardOverview() {
  const [stats, setStats] = useState({ categories: 0, menus: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    async function fetchStats() {
      try {
        const [catRes, menuRes, orderRes] = await Promise.all([
          apiRequest("/categories"),
          apiRequest("/menus"),
          apiRequest("/orders"),
        ]);
        setStats({
          categories: catRes.data?.length || 0,
          menus: menuRes.data?.length || 0,
          orders: orderRes.data?.length || 0,
        });
      } catch (err) {
        console.error("Gagal memuat statistik", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 rounded-full border-2 border-amber-500/20" />
            <div className="absolute inset-0 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
          </div>
          <p className="text-zinc-500 text-sm font-medium">Memuat data cafe...</p>
        </div>
      </div>
    );
  }

  const hours = time.getHours();
  const greeting = hours < 11 ? "Selamat Pagi" : hours < 15 ? "Selamat Siang" : hours < 18 ? "Selamat Sore" : "Selamat Malam";

  return (
    <div className="space-y-6 p-1">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-[#1a1208] to-zinc-900 p-7 md:p-10 border border-amber-500/10">
        {/* Decorative grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute top-0 right-16 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Live Dashboard
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none">
              {greeting}, <span className="text-amber-400">Manager!</span>
            </h1>
            <p className="text-zinc-400 text-sm md:text-base">
              Ikhtisar operasional cafe Anda secara real-time.
            </p>
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-4xl md:text-5xl font-black text-white tabular-nums tracking-tight">
              {time.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
            </p>
            <p className="text-zinc-400 text-sm mt-1">
              {time.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Kategori"
          value={stats.categories}
          delay="0ms"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          }
        />
        <StatCard
          label="Varian Menu"
          value={stats.menus}
          delay="80ms"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          }
        />
        <StatCard
          label="Total Pesanan"
          value={stats.orders}
          delay="160ms"
          accent
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      </div>

      {/* Quick Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quick Stats */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-5">Ringkasan Cepat</h3>
          <ActivityRow label="Menu Tersedia" sub="Item siap dipesan pelanggan" badge={`${stats.menus} item`} />
          <ActivityRow label="Kategori Aktif" sub="Pengelompokan produk cafe" badge={`${stats.categories} grup`} />
          <ActivityRow label="Total Transaksi" sub="Semua order terekam" badge={`${stats.orders} order`} />
        </div>

        {/* Tips Panel */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          <h3 className="text-sm font-bold text-amber-400/80 uppercase tracking-widest mb-5">Tips Manager</h3>
          <ul className="space-y-3 relative">
            {[
              "Perbarui stok menu secara rutin agar pelanggan tidak kecewa.",
              "Selesaikan pesanan PENDING sesegera mungkin.",
              "Tambah kategori baru untuk variasi menu yang lebih beragam.",
            ].map((tip, i) => (
              <li key={i} className="flex gap-3 items-start">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <p className="text-zinc-400 text-sm leading-relaxed">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}