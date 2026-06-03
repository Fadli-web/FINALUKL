"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
import dynamic from "next/dynamic";

// PENTING: ApexCharts butuh window browser, jadi harus di-load dinamis (No SSR)
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

// --- Komponen Pendukung ---
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
      {accent && <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-transparent pointer-events-none" />}
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

// --- Warna Kustom ---
const COLORS = ["#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e"];

export default function DashboardOverview() {
  const [stats, setStats] = useState({ categories: 0, menus: 0, orders: 0 });
  const [loading, setLoading] = useState(true);
  const [time, setTime] = useState(new Date());

  // State Data untuk ApexCharts & List
  const [statusData, setStatusData] = useState<any[]>([]);
  const [timelineData, setTimelineData] = useState<any[]>([]);
  const [stockData, setStockData] = useState<any[]>([]);
  const [topMenuData, setTopMenuData] = useState<any[]>([]);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [catRes, menuRes, orderRes] = await Promise.all([
          apiRequest("/categories"),
          apiRequest("/menus"),
          apiRequest("/orders"),
        ]);
        
        // Pengecekan ketat agar data selalu berformat array
        const menusArray = Array.isArray(menuRes.data || menuRes) ? (menuRes.data || menuRes) : [];
        const ordersArray = Array.isArray(orderRes.data || orderRes) ? (orderRes.data || orderRes) : [];
        const catsArray = Array.isArray(catRes.data || catRes) ? (catRes.data || catRes) : [];
        
        // --- 1. Total Angka ---
        setStats({
          categories: catsArray.length,
          menus: menusArray.length,
          orders: ordersArray.length,
        });

        // --- 2. Data Grafik Status Transaksi ---
        let pending = 0, completed = 0, cancelled = 0;
        ordersArray.forEach((order: any) => {
          if (order.status === "PENDING") pending++;
          else if (order.status === "COMPLETED") completed++;
          else if (order.status === "CANCELLED") cancelled++;
        });
        setStatusData([
          { name: "Menunggu", total: pending, color: "#f59e0b" },
          { name: "Selesai", total: completed, color: "#10b981" },
          { name: "Dibatalkan", total: cancelled, color: "#ef4444" },
        ]);

        // --- 3. Data Grafik Tren Waktu (Order per Jam) ---
        const hoursCount: Record<string, number> = {};
        ordersArray.forEach((order: any) => {
          if (order.createdAt) {
            const date = new Date(order.createdAt);
            const hour = date.getHours().toString().padStart(2, '0') + ":00";
            hoursCount[hour] = (hoursCount[hour] || 0) + 1;
          }
        });
        const timeline = Object.keys(hoursCount).sort().map(hour => ({
          time: hour,
          orders: hoursCount[hour]
        }));
        setTimelineData(timeline);

        // --- 4. Data Sisa Stok Menu (List View) ---
        const stockInfo = menusArray
          .map((m: any) => ({ name: m.name, stock: Number(m.stock) || 0 })) // Pastikan jadi angka
          .sort((a: any, b: any) => a.stock - b.stock) 
          .slice(0, 5); // Ambil 5 terendah
        setStockData(stockInfo);

        // --- 5. Data Menu Terlaris ---
        const menuSales: Record<number, number> = {};
        ordersArray.forEach((order: any) => {
          if (order.orderItems && Array.isArray(order.orderItems)) {
            order.orderItems.forEach((item: any) => {
               const mId = item.menuId; 
               const qty = item.quantity || 1;
               menuSales[mId] = (menuSales[mId] || 0) + qty;
            });
          } else if (order.items && Array.isArray(order.items)) {
             order.items.forEach((item: any) => {
              const mId = item.menuId; 
              const qty = item.quantity || 1;
              menuSales[mId] = (menuSales[mId] || 0) + qty;
           });
          }
        });

        const topMenus = Object.keys(menuSales).map(menuId => {
          const menu = menusArray.find((m: any) => m.id === parseInt(menuId));
          return {
            name: menu ? menu.name : `Menu #${menuId}`,
            value: menuSales[parseInt(menuId)]
          };
        }).sort((a, b) => b.value - a.value).slice(0, 4); 
        
        setTopMenuData(topMenus);

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
          <p className="text-zinc-500 text-sm font-medium">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  const hours = time.getHours();
  const greeting = hours < 11 ? "Selamat Pagi" : hours < 15 ? "Selamat Siang" : hours < 18 ? "Selamat Sore" : "Selamat Malam";

  // Konfigurasi Global ApexCharts
  const commonOptions: any = {
    chart: { background: 'transparent', toolbar: { show: false }, fontFamily: 'inherit' },
    theme: { mode: 'dark' },
    grid: { borderColor: 'rgba(255, 255, 255, 0.05)', strokeDashArray: 4 },
    dataLabels: { enabled: false },
    tooltip: { theme: 'dark', style: { fontSize: '12px' } }
  };

  return (
    <div className="space-y-6 p-1">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-[#1a1208] to-zinc-900 p-7 md:p-10 border border-amber-500/10">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)", backgroundSize: "40px 40px" }}
        />
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
            <p className="text-zinc-400 text-sm md:text-base">Ikhtisar operasional cafe Anda secara real-time.</p>
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

      {/* Stats Grid Atas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Kategori"
          value={stats.categories}
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
        />
        <StatCard
          label="Varian Menu"
          value={stats.menus}
          delay="80ms"
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
        />
        <StatCard
          label="Total Pesanan"
          value={stats.orders}
          delay="160ms"
          accent
          icon={<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
        />
      </div>

      {/* === ROW 1 GRAFIK: Tren Waktu (Besar) & Info === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Tren Pesanan (Apex Area Chart) */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 lg:col-span-2 flex flex-col">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-6">Tren Pesanan Harian</h3>
          {timelineData.length > 0 ? (
            <div className="flex-1 w-full min-h-[250px]">
              <ReactApexChart 
                type="area" 
                height="100%"
                series={[{ name: "Total Pesanan", data: timelineData.map(d => d.orders) }]}
                options={{
                  ...commonOptions,
                  colors: ['#f59e0b'],
                  stroke: { curve: 'smooth', width: 3 },
                  fill: { type: 'gradient', gradient: { shadeIntensity: 1, opacityFrom: 0.4, opacityTo: 0.0, stops: [0, 100] } },
                  xaxis: { 
                    categories: timelineData.map(d => d.time), 
                    axisBorder: { show: false }, 
                    axisTicks: { show: false },
                    labels: { style: { colors: '#a1a1aa' } }
                  },
                  yaxis: { labels: { style: { colors: '#a1a1aa' } } }
                }} 
              />
            </div>
          ) : (
             <div className="flex-1 flex items-center justify-center text-zinc-600 text-sm">Belum ada data waktu pesanan</div>
          )}
        </div>

        {/* Ringkasan & Tips */}
        <div className="space-y-4 lg:col-span-1">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-5">Ringkasan</h3>
            <ActivityRow label="Menu Tersedia" sub="Item siap dipesan" badge={`${stats.menus} item`} />
            <ActivityRow label="Total Transaksi" sub="Semua order terekam" badge={`${stats.orders} order`} />
          </div>
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-2xl p-6">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <h3 className="text-sm font-bold text-amber-400/80 uppercase tracking-widest mb-3">Tips Hari Ini</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Pastikan stok pada item yang paling laris (Top Menu) selalu tersedia agar omset tetap maksimal. Pantau daftar sisa stok di bawah.
            </p>
          </div>
        </div>
      </div>

      {/* === ROW 2 GRAFIK: Status, Top Menu, Stok List === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Status Transaksi (Apex Bar Chart) */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex flex-col h-[320px]">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Status Pesanan</h3>
          <div className="flex-1 w-full">
            <ReactApexChart 
              type="bar" 
              height="100%"
              series={[{ name: "Jumlah", data: statusData.map(d => d.total) }]}
              options={{
                ...commonOptions,
                colors: statusData.map(d => d.color),
                plotOptions: { bar: { borderRadius: 4, distributed: true, columnWidth: '55%' } },
                legend: { show: false },
                xaxis: { 
                  categories: statusData.map(d => d.name),
                  labels: { style: { colors: '#a1a1aa', fontSize: '11px' } },
                  axisBorder: { show: false },
                  axisTicks: { show: false }
                },
                yaxis: { labels: { style: { colors: '#a1a1aa' } } }
              }} 
            />
          </div>
        </div>


        {/* Sisa Stok Warning (List View) */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 flex flex-col h-[320px]">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">Peringatan Stok</h3>
          
          {stockData.length > 0 ? (
            <div className="flex-1 w-full overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {stockData.map((item, idx) => {
                const isOutOfStock = item.stock === 0;
                
                return (
                  <div 
                    key={idx} 
                    className="flex items-center justify-between p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative flex h-2.5 w-2.5">
                        {isOutOfStock && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOutOfStock ? 'bg-red-500' : 'bg-amber-500'}`}></span>
                      </div>
                      <p className="text-sm font-medium text-zinc-200 line-clamp-1">{item.name}</p>
                    </div>
                    
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                      isOutOfStock
                        ? "bg-red-500/10 text-red-400 border border-red-500/20"
                        : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                    }`}>
                      {isOutOfStock ? "Habis!" : `Sisa ${item.stock}`}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-2">
              <svg className="w-8 h-8 text-zinc-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm">Stok menu aman</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}