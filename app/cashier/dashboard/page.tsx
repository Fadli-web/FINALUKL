"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
import Link from "next/link";

export default function CashierDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [orderRes, menuRes] = await Promise.all([
          apiRequest("/orders"),
          apiRequest("/menus"),
        ]);
        const sortedOrders = (orderRes.data || []).sort(
          (a: any, b: any) => b.id - a.id
        );
        setOrders(sortedOrders);
        setMenus(menuRes.data || []);
      } catch (err) {
        console.error("Gagal memuat data dashboard kasir", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getOrderItems = (order: any): any[] =>
    order.items ||
    order.order_items ||
    order.detail_order ||
    order.order_detail ||
    order.detail_transaksi ||
    [];

  const pendingOrders = orders.filter((o) => o.status === "PENDING");
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");
  const cancelledOrders = orders.filter((o) => o.status === "CANCELLED");

  const totalRevenue = completedOrders.reduce((total, order) => {
    const items = getOrderItems(order);
    const orderTotal = items.reduce((sub: number, item: any) => {
      const menuId = item.menuId || item.menu_id;
      const matched = item.menu || menus.find((m) => m.id === menuId);
      const price = matched ? matched.price : item.price || 0;
      return sub + price * item.quantity;
    }, 0);
    return total + orderTotal;
  }, 0);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  const formatDate = (date: Date) =>
    date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const getStatusStyle = (status: string) => {
    if (status === "COMPLETED")
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
    if (status === "PENDING")
      return "bg-amber-500/10 text-amber-400 border-amber-500/30";
    return "bg-rose-500/10 text-rose-400 border-rose-500/30";
  };

  if (loading) {
    return (
      <div
        style={{ background: "#0d0a08" }}
        className="min-h-screen flex flex-col items-center justify-center gap-4"
      >
        <div className="relative w-16 h-16">
          <div
            className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping"
            style={{ animationDuration: "1.5s" }}
          />
          <div className="absolute inset-2 rounded-full border-2 border-t-amber-500 border-amber-500/10 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            ☕
          </div>
        </div>
        <p
          className="text-sm font-medium tracking-widest uppercase animate-pulse"
          style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}
        >
          Menyiapkan Ruang Kasir...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "#0d0a08",
        minHeight: "100vh",
        fontFamily: "'Georgia', serif",
      }}
      className="text-stone-100 pb-16"
    >
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* ── HEADER ── */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div
              className="text-xs tracking-[0.3em] uppercase mb-2"
              style={{ color: "#c8923a", fontFamily: "'Courier New', monospace" }}
            >
              ◈ Sistem Kasir / Dashboard
            </div>
            <h1
              className="text-4xl sm:text-5xl font-bold leading-none"
              style={{ color: "#f5e6d0", letterSpacing: "-0.02em" }}
            >
              Ruang Kerja
              <br />
              <span style={{ color: "#c8923a" }}>Kasir</span>
            </h1>
          </div>
          <div
            className="text-right p-4 rounded-2xl border"
            style={{
              background: "rgba(200,146,58,0.06)",
              borderColor: "rgba(200,146,58,0.2)",
            }}
          >
            <div
              className="text-3xl font-bold tabular-nums"
              style={{ color: "#f5e6d0", fontFamily: "'Courier New', monospace" }}
            >
              {formatTime(currentTime)}
            </div>
            <div
              className="text-xs mt-1"
              style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}
            >
              {formatDate(currentTime)}
            </div>
          </div>
        </header>

        {/* ── DIVIDER ── */}
        <div
          className="h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, rgba(200,146,58,0.4), transparent)",
          }}
        />

        {/* ── METRIC CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              icon: "💰",
              label: "Pendapatan Selesai",
              value: `Rp ${totalRevenue.toLocaleString("id-ID")}`,
              accent: "#10b981",
              bg: "rgba(16,185,129,0.06)",
              border: "rgba(16,185,129,0.2)",
            },
            {
              icon: "🔔",
              label: "Antrean Pending",
              value: `${pendingOrders.length} Order`,
              accent: "#c8923a",
              bg: "rgba(200,146,58,0.06)",
              border: "rgba(200,146,58,0.2)",
            },
            {
              icon: "✅",
              label: "Transaksi Selesai",
              value: `${completedOrders.length} Order`,
              accent: "#60a5fa",
              bg: "rgba(96,165,250,0.06)",
              border: "rgba(96,165,250,0.2)",
            },
            {
              icon: "🧾",
              label: "Total Nota Hari Ini",
              value: `${orders.length} Transaksi`,
              accent: "#a78bfa",
              bg: "rgba(167,139,250,0.06)",
              border: "rgba(167,139,250,0.2)",
            },
          ].map((card, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl border relative overflow-hidden transition-transform hover:-translate-y-1 duration-200"
              style={{ background: card.bg, borderColor: card.border }}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl pointer-events-none"
                style={{ background: card.accent, opacity: 0.08 }}
              />
              <div className="text-2xl mb-3">{card.icon}</div>
              <div
                className="text-[10px] tracking-widest uppercase mb-1"
                style={{
                  color: "#8a7560",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {card.label}
              </div>
              <div
                className="text-xl sm:text-2xl font-bold leading-tight"
                style={{ color: card.accent, fontFamily: "'Georgia', serif" }}
              >
                {card.value}
              </div>
            </div>
          ))}
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div
          className="p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{
            background: "rgba(200,146,58,0.05)",
            borderColor: "rgba(200,146,58,0.2)",
          }}
        >
          <div>
            <h3
              className="text-lg font-semibold"
              style={{ color: "#f5e6d0" }}
            >
              Aksi Cepat
            </h3>
            <p
              className="text-xs mt-1"
              style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}
            >
              Navigasi ke mesin POS atau pantau dapur langsung.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/cashier/pos"
              className="flex-1 sm:flex-none text-center font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-95 hover:opacity-90"
              style={{
                background: "linear-gradient(135deg, #c8923a, #e8a84a)",
                color: "#0d0a08",
                boxShadow: "0 4px 20px rgba(200,146,58,0.3)",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.05em",
              }}
            >
              + BUKA MESIN POS
            </Link>
            <Link
              href="/cashier/orders"
              className="flex-1 sm:flex-none text-center font-bold px-6 py-3 rounded-xl text-sm transition-all active:scale-95"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#c8b89a",
                fontFamily: "'Courier New', monospace",
                letterSpacing: "0.05em",
              }}
            >
              🍳 PANTAU DAPUR
            </Link>
          </div>
        </div>

        {/* ── STATUS BARS ── */}
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: "Pending",
              count: pendingOrders.length,
              color: "#c8923a",
              max: orders.length || 1,
            },
            {
              label: "Selesai",
              count: completedOrders.length,
              color: "#10b981",
              max: orders.length || 1,
            },
            {
              label: "Dibatalkan",
              count: cancelledOrders.length,
              color: "#f43f5e",
              max: orders.length || 1,
            },
          ].map((s, i) => (
            <div key={i}>
              <div className="flex justify-between items-center mb-1">
                <span
                  className="text-[10px] tracking-widest uppercase"
                  style={{
                    color: s.color,
                    fontFamily: "'Courier New', monospace",
                  }}
                >
                  {s.label}
                </span>
                <span
                  className="text-xs font-bold"
                  style={{ color: "#c8b89a", fontFamily: "'Courier New', monospace" }}
                >
                  {s.count}
                </span>
              </div>
              <div
                className="h-1.5 rounded-full overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${(s.count / s.max) * 100}%`,
                    background: s.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ── TRANSAKSI TERKINI ── */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="h-px flex-1"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
            <h3
              className="text-xs tracking-widest uppercase"
              style={{
                color: "#c8923a",
                fontFamily: "'Courier New', monospace",
              }}
            >
              ◈ Transaksi Terkini
            </h3>
            <div
              className="h-px flex-1"
              style={{ background: "rgba(255,255,255,0.06)" }}
            />
          </div>

          <div
            className="rounded-2xl border overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: "rgba(255,255,255,0.06)",
            }}
          >
            {/* Table Header */}
            <div
              className="grid grid-cols-3 px-5 py-3 border-b text-[10px] tracking-widest uppercase"
              style={{
                borderColor: "rgba(255,255,255,0.06)",
                color: "#8a7560",
                fontFamily: "'Courier New', monospace",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <span>Nota</span>
              <span className="text-center">Pelanggan</span>
              <span className="text-right">Status</span>
            </div>

            <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
              {orders.slice(0, 8).map((order) => (
                <div
                  key={order.id}
                  className="grid grid-cols-3 px-5 py-4 items-center transition-colors hover:bg-white/[0.02]"
                >
                  <div>
                    <p
                      className="font-bold text-sm"
                      style={{ color: "#f5e6d0", fontFamily: "'Courier New', monospace" }}
                    >
                      #CAFE-{order.id}
                    </p>
                    <p
                      className="text-[10px] mt-0.5"
                      style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}
                    >
                      {getOrderItems(order).length} item
                    </p>
                  </div>
                  <p
                    className="text-xs text-center"
                    style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}
                  >
                    {order.userId ? `ID: ${order.userId}` : "GUEST"}
                  </p>
                  <div className="flex justify-end">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-widest uppercase ${getStatusStyle(order.status)}`}
                      style={{ fontFamily: "'Courier New', monospace" }}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div
                  className="py-12 text-center text-sm"
                  style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}
                >
                  — Belum ada transaksi terekam —
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer ornament */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <div
            className="h-px w-16"
            style={{ background: "rgba(200,146,58,0.3)" }}
          />
          <span className="text-amber-700 text-lg">◈</span>
          <div
            className="h-px w-16"
            style={{ background: "rgba(200,146,58,0.3)" }}
          />
        </div>
      </div>
    </div>
  );
}