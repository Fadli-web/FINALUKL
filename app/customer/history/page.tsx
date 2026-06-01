"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";

interface OrderItem {
  id: number;
  menuId: number;
  quantity: number;
  menu?: { id: number; name: string; price: number };
}

interface Order {
  id: number;
  userId: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt?: string;
  items: OrderItem[];
}

interface Menu {
  id: number;
  name: string;
  price: number;
}

// Robust item resolver — handles multiple API response shapes
function resolveItems(order: any): OrderItem[] {
  return (
    order.items ||
    order.order_items ||
    order.detail_order ||
    order.orderItems ||
    []
  );
}

function resolveMenuName(item: OrderItem, menuMap: Record<number, Menu>): string {
  return item.menu?.name || menuMap[item.menuId]?.name || `Menu #${item.menuId}`;
}

function resolveMenuPrice(item: OrderItem, menuMap: Record<number, Menu>): number {
  return item.menu?.price ?? menuMap[item.menuId]?.price ?? 0;
}

function calcTotal(order: Order, menuMap: Record<number, Menu>): number {
  return resolveItems(order).reduce((sum, item) => {
    return sum + resolveMenuPrice(item, menuMap) * item.quantity;
  }, 0);
}

const STATUS_CFG = {
  PENDING: {
    label: "Diproses Dapur",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    dot: "bg-amber-400 animate-ping",
    dotBg: "bg-amber-400",
    bar: "bg-amber-500",
  },
  COMPLETED: {
    label: "Selesai Disajikan",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    dot: "bg-emerald-400",
    dotBg: "bg-emerald-400",
    bar: "bg-emerald-500",
  },
  CANCELLED: {
    label: "Dibatalkan",
    badge: "bg-zinc-500/15 text-zinc-500 border-zinc-500/20",
    dot: "bg-zinc-600",
    dotBg: "bg-zinc-600",
    bar: "bg-zinc-700",
  },
};

function ReceiptCard({ order, menuMap }: { order: Order; menuMap: Record<number, Menu> }) {
  const [expanded, setExpanded] = useState(false);
  const items = resolveItems(order);
  const total = calcTotal(order, menuMap);
  const cfg = STATUS_CFG[order.status];

  return (
    <div
      className={`bg-white/[0.03] border rounded-2xl overflow-hidden transition-all duration-300 ${
        order.status === "PENDING"
          ? "border-amber-500/20 hover:border-amber-500/35"
          : order.status === "COMPLETED"
          ? "border-white/[0.08] hover:border-white/[0.16]"
          : "border-white/[0.05] opacity-70 hover:opacity-100"
      }`}
    >
      {/* Top accent bar */}
      <div className={`h-0.5 w-full ${cfg.bar} opacity-60`} />

      {/* Header row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left flex items-center gap-4 p-5 hover:bg-white/[0.02] transition"
      >
        {/* Status dot */}
        <div className="relative flex-shrink-0 w-3 h-3">
          {order.status === "PENDING" && (
            <span className={`absolute inset-0 rounded-full ${cfg.dot} opacity-75`} />
          )}
          <span className={`relative block w-3 h-3 rounded-full ${cfg.dotBg}`} />
        </div>

        {/* ID */}
        <div className="flex-shrink-0">
          <p className="text-white font-black tabular-nums text-base">
            #CAFE‑{String(order.id).padStart(4, "0")}
          </p>
          <p className="text-zinc-600 text-xs mt-0.5">{items.length} variasi item</p>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Status badge */}
        <span className={`flex-shrink-0 text-[10px] font-bold uppercase tracking-wider border px-2.5 py-1 rounded-full ${cfg.badge}`}>
          {cfg.label}
        </span>

        {/* Chevron */}
        <svg
          className={`w-4 h-4 text-zinc-500 transition-transform duration-200 flex-shrink-0 ${expanded ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable detail */}
      <div
        className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-screen" : "max-h-0"}`}
      >
        <div className="border-t border-white/[0.06] px-5 pt-4 pb-5 space-y-4">
          {/* Items list */}
          <div className="space-y-2.5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600 mb-3">
              Rincian Pesanan
            </p>
            {items.length === 0 ? (
              <p className="text-zinc-600 text-xs italic">Detail item tidak tersedia.</p>
            ) : (
              items.map((item, i) => {
                const name = resolveMenuName(item, menuMap);
                const price = resolveMenuPrice(item, menuMap);
                const sub = price * item.quantity;

                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-500 font-black text-xs flex-shrink-0">
                      {item.quantity}×
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-200 truncate">{name}</p>
                      {price > 0 && (
                        <p className="text-xs text-zinc-600">
                          Rp {price.toLocaleString("id-ID")} / item
                        </p>
                      )}
                    </div>
                    {sub > 0 && (
                      <span className="text-sm font-bold text-zinc-300 flex-shrink-0">
                        Rp {sub.toLocaleString("id-ID")}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Total row */}
          {total > 0 && (
            <div className="border-t border-white/[0.08] pt-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Total Pembayaran
              </span>
              <span className="text-xl font-black text-amber-400">
                Rp {total.toLocaleString("id-ID")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CustomerHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuMap, setMenuMap] = useState<Record<number, Menu>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING" | "COMPLETED" | "CANCELLED">("ALL");

  useEffect(() => {
    async function load() {
      try {
        const [orderRes, menuRes] = await Promise.all([
          apiRequest("/orders"),
          apiRequest("/menus"),
        ]);

        const sorted = ((orderRes.data || []) as Order[]).sort((a, b) => b.id - a.id);
        setOrders(sorted);

        // Build a menuId→menu lookup map for fast O(1) price/name resolution
        const map: Record<number, Menu> = {};
        (menuRes.data || []).forEach((m: Menu) => { map[m.id] = m; });
        setMenuMap(map);
      } catch {
        console.error("Gagal memuat histori transaksi");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const counts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  const filtered = activeTab === "ALL" ? orders : orders.filter((o) => o.status === activeTab);

  const TABS: { key: typeof activeTab; label: string }[] = [
    { key: "ALL", label: "Semua" },
    { key: "PENDING", label: "Aktif" },
    { key: "COMPLETED", label: "Selesai" },
    { key: "CANCELLED", label: "Dibatal" },
  ];

  return (
    <div className="space-y-6 p-1 max-w-2xl mx-auto">
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-2">Riwayat</p>
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Pesanan Saya</h2>
        <p className="text-zinc-500 text-sm mt-1.5">Pantau status pengerjaan dan rincian nota belanja.</p>
      </div>

      {/* Summary mini cards */}
      {!loading && orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total", value: counts.ALL, color: "text-white" },
            { label: "Aktif", value: counts.PENDING, color: "text-amber-400" },
            { label: "Selesai", value: counts.COMPLETED, color: "text-emerald-400" },
            { label: "Dibatal", value: counts.CANCELLED, color: "text-zinc-500" },
          ].map((s) => (
            <div key={s.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
              <p className="text-xs font-medium text-zinc-600 mb-1">{s.label}</p>
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      {!loading && orders.length > 0 && (
        <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${
                activeTab === tab.key
                  ? "bg-amber-500 text-black shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tab.label}
              {counts[tab.key] > 0 && (
                <span className={`ml-1.5 text-xs font-black ${activeTab === tab.key ? "text-black/60" : "text-zinc-600"}`}>
                  {counts[tab.key]}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl mb-4">
            🧾
          </div>
          <p className="text-zinc-300 font-bold">
            {orders.length === 0 ? "Belum ada pesanan" : "Tidak ada pesanan di tab ini"}
          </p>
          {orders.length === 0 && (
            <>
              <p className="text-zinc-600 text-sm mt-1 mb-6">Mulai pesan menu favoritmu sekarang.</p>
              <a
                href="/customer"
                className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20"
              >
                Lihat Menu
              </a>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <ReceiptCard key={order.id} order={order} menuMap={menuMap} />
          ))}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <p className="text-center text-zinc-600 text-xs">{filtered.length} transaksi ditampilkan</p>
      )}
    </div>
  );
}