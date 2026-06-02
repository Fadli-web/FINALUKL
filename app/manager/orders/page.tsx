// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { apiRequest } from "@/utils/api";

// interface Order {
//   id: number;
//   userId: number;
//   status: "PENDING" | "COMPLETED" | "CANCELLED";
//   createdAt: string;
//   items: Array<{ id: number; menuId: number; quantity: number }>;
// }

// type TabFilter = "ALL" | "PENDING" | "COMPLETED" | "CANCELLED";

// const STATUS_CONFIG = {
//   PENDING: {
//     label: "Pending",
//     dot: "bg-amber-400 shadow-amber-400/60",
//     badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",
//     card: "border-amber-500/20 hover:border-amber-500/40",
//   },
//   COMPLETED: {
//     label: "Selesai",
//     dot: "bg-emerald-400 shadow-emerald-400/60",
//     badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
//     card: "border-white/[0.08] hover:border-white/[0.16]",
//   },
//   CANCELLED: {
//     label: "Dibatal",
//     dot: "bg-zinc-600",
//     badge: "bg-zinc-500/15 text-zinc-500 border-zinc-500/20",
//     card: "border-white/[0.06] hover:border-white/10 opacity-60 hover:opacity-100",
//   },
// };

// function CountBadge({ count, active }: { count: number; active: boolean }) {
//   if (count === 0) return null;
//   return (
//     <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-black ${active ? "bg-black/20 text-current" : "bg-white/[0.06] text-zinc-500"}`}>
//       {count}
//     </span>
//   );
// }

// export default function ManagerOrdersPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState<TabFilter>("ALL");
//   const [updatingId, setUpdatingId] = useState<number | null>(null);

//   const fetchOrders = useCallback(async () => {
//     try {
//       const res = await apiRequest("/orders");
//       const sorted = (res.data || []).sort((a: Order, b: Order) => b.id - a.id);
//       setOrders(sorted);
//     } catch {
//       alert("Gagal memuat daftar transaksi");
//     } finally {
//       setPageLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchOrders(); }, [fetchOrders]);

//   const handleUpdateStatus = async (id: number, targetStatus: "COMPLETED" | "CANCELLED") => {
//     const labels = { COMPLETED: "Selesaikan", CANCELLED: "Batalkan" };
//     if (!confirm(`${labels[targetStatus]} order #${id}?`)) return;
//     setUpdatingId(id);
//     try {
//       await apiRequest(`/orders/${id}/status`, {
//         method: "PUT",
//         body: JSON.stringify({ status: targetStatus }),
//       });
//       fetchOrders();
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const counts = {
//     ALL: orders.length,
//     PENDING: orders.filter((o) => o.status === "PENDING").length,
//     COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
//     CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
//   };

//   const filteredOrders = activeTab === "ALL" ? orders : orders.filter((o) => o.status === activeTab);

//   const TABS: { key: TabFilter; label: string }[] = [
//     { key: "ALL", label: "Semua" },
//     { key: "PENDING", label: "Pending" },
//     { key: "COMPLETED", label: "Selesai" },
//     { key: "CANCELLED", label: "Dibatal" },
//   ];

//   return (
//     <div className="space-y-6 p-1">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
//         <div>
//           <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-2">Manajemen</p>
//           <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Transaksi</h2>
//           <p className="text-zinc-500 text-sm mt-1.5">Pantau antrean pesanan dan selesaikan invoice kasir.</p>
//         </div>
//         <button
//           onClick={fetchOrders}
//           className="inline-flex items-center gap-2 bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] text-zinc-300 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all flex-shrink-0"
//         >
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
//           </svg>
//           Refresh
//         </button>
//       </div>

//       {/* Summary cards */}
//       <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//         {[
//           { label: "Total Order", value: counts.ALL, color: "text-white" },
//           { label: "Menunggu", value: counts.PENDING, color: "text-amber-400" },
//           { label: "Selesai", value: counts.COMPLETED, color: "text-emerald-400" },
//           { label: "Dibatal", value: counts.CANCELLED, color: "text-zinc-500" },
//         ].map((item) => (
//           <div key={item.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
//             <p className="text-xs font-medium text-zinc-500 mb-1">{item.label}</p>
//             <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
//           </div>
//         ))}
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 w-fit">
//         {TABS.map((tab) => (
//           <button
//             key={tab.key}
//             onClick={() => setActiveTab(tab.key)}
//             className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center ${
//               activeTab === tab.key
//                 ? "bg-amber-500 text-black shadow-sm"
//                 : "text-zinc-400 hover:text-zinc-200"
//             }`}
//           >
//             {tab.label}
//             <CountBadge count={counts[tab.key]} active={activeTab === tab.key} />
//           </button>
//         ))}
//       </div>

//       {/* Orders */}
//       {pageLoading ? (
//         <div className="space-y-3">
//           {[...Array(5)].map((_, i) => (
//             <div key={i} className="h-24 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
//           ))}
//         </div>
//       ) : filteredOrders.length === 0 ? (
//         <div className="flex flex-col items-center justify-center py-24 text-center">
//           <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl mb-4">
//             📋
//           </div>
//           <p className="text-zinc-300 font-bold">Tidak ada transaksi</p>
//           <p className="text-zinc-600 text-sm mt-1">Belum ada order {activeTab !== "ALL" ? `berstatus ${activeTab}` : ""}.</p>
//         </div>
//       ) : (
//         <div className="space-y-3">
//           {filteredOrders.map((order) => {
//             const cfg = STATUS_CONFIG[order.status];
//             const isUpdating = updatingId === order.id;

//             return (
//               <div
//                 key={order.id}
//                 className={`group relative bg-white/[0.03] hover:bg-white/[0.05] border ${cfg.card} rounded-2xl p-5 transition-all duration-300 flex flex-col sm:flex-row sm:items-center gap-4`}
//               >
//                 {/* Left: status dot + ID */}
//                 <div className="flex items-center gap-4 flex-shrink-0">
//                   <div className={`w-2.5 h-2.5 rounded-full shadow-sm ${cfg.dot}`} />
//                   <div>
//                     <p className="text-white font-black text-lg tabular-nums">#{order.id}</p>
//                     <p className="text-zinc-500 text-xs">
//                       User #{order.userId}
//                     </p>
//                   </div>
//                 </div>

//                 {/* Divider */}
//                 <div className="hidden sm:block w-px h-10 bg-white/[0.06] flex-shrink-0" />

//                 {/* Center: info */}
//                 <div className="flex flex-wrap gap-3 flex-1">
//                   <div className="bg-white/[0.04] rounded-lg px-3 py-2">
//                     <p className="text-xs text-zinc-500 mb-0.5">Item</p>
//                     <p className="text-sm font-bold text-white">{order.items?.length || 0} variasi</p>
//                   </div>
//                   <div className="bg-white/[0.04] rounded-lg px-3 py-2">
//                     <p className="text-xs text-zinc-500 mb-0.5">Total Qty</p>
//                     <p className="text-sm font-bold text-white">
//                       {order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0} pcs
//                     </p>
//                   </div>
//                   <div className="bg-white/[0.04] rounded-lg px-3 py-2">
//                     <p className="text-xs text-zinc-500 mb-0.5">Status</p>
//                     <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${cfg.badge}`}>
//                       {cfg.label}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Right: actions */}
//                 <div className="flex gap-2 flex-shrink-0 sm:ml-auto">
//                   {order.status === "PENDING" ? (
//                     <>
//                       <button
//                         disabled={isUpdating}
//                         onClick={() => handleUpdateStatus(order.id, "COMPLETED")}
//                         className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20 hover:-translate-y-0.5"
//                       >
//                         {isUpdating ? (
//                           <div className="w-3 h-3 border-2 border-black/40 border-t-black rounded-full animate-spin" />
//                         ) : (
//                           <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
//                             <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                           </svg>
//                         )}
//                         Selesaikan
//                       </button>
//                       <button
//                         disabled={isUpdating}
//                         onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
//                         className="flex items-center gap-2 bg-white/[0.06] hover:bg-red-500/10 border border-white/[0.08] hover:border-red-500/30 text-zinc-400 hover:text-red-400 disabled:opacity-60 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
//                       >
//                         <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                           <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                         Batal
//                       </button>
//                     </>
//                   ) : (
//                     <span className="text-zinc-600 text-xs font-medium italic bg-white/[0.03] px-4 py-2.5 rounded-xl border border-white/[0.06]">
//                       Diarsipkan
//                     </span>
//                   )}
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {!pageLoading && filteredOrders.length > 0 && (
//         <p className="text-center text-zinc-600 text-xs">{filteredOrders.length} transaksi ditampilkan</p>
//       )}
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useCallback } from "react";
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
  createdAt: string;
  items: OrderItem[];
  user?: {
    id: number;
    username: string;
  };
}

interface Menu {
  id: number;
  name: string;
  price: number;
}

type TabFilter = "ALL" | "PENDING" | "COMPLETED" | "CANCELLED";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    dot: "bg-amber-400 shadow-amber-400/60",
    badge: "bg-amber-500/15 text-amber-400 border-amber-500/25",
    card: "border-amber-500/20 hover:border-amber-500/40",
  },
  COMPLETED: {
    label: "Selesai",
    dot: "bg-emerald-400 shadow-emerald-400/60",
    badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
    card: "border-white/[0.08] hover:border-white/[0.16]",
  },
  CANCELLED: {
    label: "Dibatal",
    dot: "bg-zinc-600",
    badge: "bg-zinc-500/15 text-zinc-500 border-zinc-500/20",
    card: "border-white/[0.06] hover:border-white/10 opacity-60 hover:opacity-100",
  },
};

function CountBadge({ count, active }: { count: number; active: boolean }) {
  if (count === 0) return null;
  return (
    <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs font-black ${active ? "bg-black/20 text-current" : "bg-white/[0.06] text-zinc-500"}`}>
      {count}
    </span>
  );
}

// Helper untuk format tanggal & waktu
function formatDateTime(dateString?: string) {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

// Resolvers untuk item array & nama menu
function resolveItems(order: any): OrderItem[] {
  return order.items || order.order_items || order.detail_order || order.orderItems || [];
}

function resolveMenuName(item: OrderItem, menuMap: Record<number, Menu>): string {
  return item.menu?.name || menuMap[item.menuId]?.name || `Menu #${item.menuId}`;
}

// Komponen Card Pesanan
function ManagerOrderCard({
  order,
  menuMap,
  isUpdating,
  onUpdateStatus,
}: {
  order: Order;
  menuMap: Record<number, Menu>;
  isUpdating: boolean;
  onUpdateStatus: (id: number, status: "COMPLETED" | "CANCELLED") => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status];
  const items = resolveItems(order);
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={`group relative bg-white/[0.03] border ${cfg.card} rounded-2xl overflow-hidden transition-all duration-300 flex flex-col`}
    >
      {/* Area Utama (Selalu Tampil) */}
      <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-white/[0.02]">
        {/* Kiri: Status dot + ID + Info User + Waktu */}
        <div className="flex items-start gap-4 flex-shrink-0 sm:w-48">
          <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shadow-sm ${cfg.dot}`} />
          <div className="space-y-1">
            <p className="text-white font-black text-lg tabular-nums leading-none">#{order.id}</p>
            <div className="space-y-0.5">
              <p className="text-zinc-400 text-xs font-medium">
                {order.user?.username ? (
                  <>
                    <span className="text-zinc-200">{order.user.username}</span> (ID: {order.userId})
                  </>
                ) : (
                  <span>ID Pemesan: {order.userId}</span>
                )}
              </p>
              <p className="text-zinc-500 text-[10px] flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {formatDateTime(order.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Garis Pemisah (Desktop) */}
        <div className="hidden sm:block w-px h-10 bg-white/[0.06] flex-shrink-0" />

        {/* Tengah: Ringkasan & Tombol Expand */}
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="bg-white/[0.04] rounded-lg px-3 py-2">
            <p className="text-xs text-zinc-500 mb-0.5">Total Qty</p>
            <p className="text-sm font-bold text-white">{totalQty} pcs</p>
          </div>
          <div className="bg-white/[0.04] rounded-lg px-3 py-2">
            <p className="text-xs text-zinc-500 mb-0.5">Status</p>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${cfg.badge}`}>
              {cfg.label}
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-auto sm:ml-0 flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition-colors bg-white/[0.03] hover:bg-white/[0.08] px-3 py-2 rounded-lg border border-white/[0.05]"
          >
            {expanded ? "Tutup Detail" : "Lihat Detail"}
            <svg className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Kanan: Aksi Manager */}
        <div className="flex gap-2 flex-shrink-0 sm:ml-auto border-t sm:border-t-0 border-white/[0.06] pt-4 sm:pt-0 mt-2 sm:mt-0">
          {order.status === "PENDING" ? (
            <>
              <button
                disabled={isUpdating}
                onClick={() => onUpdateStatus(order.id, "COMPLETED")}
                className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-black font-bold text-xs px-4 py-2.5 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/20"
              >
                {isUpdating ? (
                  <div className="w-3 h-3 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                ) : (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
                Selesaikan
              </button>
              <button
                disabled={isUpdating}
                onClick={() => onUpdateStatus(order.id, "CANCELLED")}
                className="flex-1 sm:flex-none flex justify-center items-center gap-2 bg-white/[0.06] hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/30 text-zinc-400 hover:text-rose-400 disabled:opacity-60 font-bold text-xs px-4 py-2.5 rounded-xl transition-all"
              >
                Batal
              </button>
            </>
          ) : (
            <span className="w-full text-center sm:w-auto text-zinc-600 text-xs font-medium italic bg-white/[0.03] px-4 py-2.5 rounded-xl border border-white/[0.06]">
              Telah Diarsipkan
            </span>
          )}
        </div>
      </div>

      {/* Area Expandable (Rincian Pesanan) */}
      <div className={`overflow-hidden transition-all duration-300 ${expanded ? "max-h-screen" : "max-h-0"}`}>
        <div className="border-t border-white/[0.06] bg-black/20 p-5 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            Daftar Item Pesanan
          </p>
          {items.length === 0 ? (
            <p className="text-zinc-500 text-xs italic">Tidak ada rincian item.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.02] p-2.5 rounded-xl border border-white/[0.04]">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 font-black text-xs flex-shrink-0">
                    {item.quantity}x
                  </div>
                  <p className="text-sm font-semibold text-zinc-200 truncate">
                    {resolveMenuName(item, menuMap)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ManagerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuMap, setMenuMap] = useState<Record<number, Menu>>({});
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabFilter>("ALL");
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setPageLoading(true);
      // Mengambil data orders dan menus secara bersamaan
      const [orderRes, menuRes] = await Promise.all([
        apiRequest("/orders"),
        apiRequest("/menus"),
      ]);
      
      const sorted = ((orderRes.data || orderRes) as Order[]).sort((a: Order, b: Order) => b.id - a.id);
      setOrders(sorted);

      // Membuat map untuk mempercepat pencarian nama menu (O(1))
      const map: Record<number, Menu> = {};
      ((menuRes.data || menuRes) as Menu[]).forEach((m) => { map[m.id] = m; });
      setMenuMap(map);
    } catch {
      alert("Gagal memuat daftar transaksi");
    } finally {
      setPageLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleUpdateStatus = async (id: number, targetStatus: "COMPLETED" | "CANCELLED") => {
    const labels = { COMPLETED: "Selesaikan", CANCELLED: "Batalkan" };
    if (!confirm(`${labels[targetStatus]} order #${id}?`)) return;
    setUpdatingId(id);
    try {
      await apiRequest(`/orders/${id}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: targetStatus }),
      });
      fetchOrders();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    ALL: orders.length,
    PENDING: orders.filter((o) => o.status === "PENDING").length,
    COMPLETED: orders.filter((o) => o.status === "COMPLETED").length,
    CANCELLED: orders.filter((o) => o.status === "CANCELLED").length,
  };

  const filteredOrders = activeTab === "ALL" ? orders : orders.filter((o) => o.status === activeTab);

  const TABS: { key: TabFilter; label: string }[] = [
    { key: "ALL", label: "Semua" },
    { key: "PENDING", label: "Pending" },
    { key: "COMPLETED", label: "Selesai" },
    { key: "CANCELLED", label: "Dibatal" },
  ];

  return (
    <div className="space-y-6 p-1">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-2">Manajemen</p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Transaksi</h2>
          <p className="text-zinc-500 text-sm mt-1.5">Pantau antrean pesanan dan selesaikan invoice kasir.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="inline-flex items-center justify-center gap-2 bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] text-zinc-300 font-semibold text-sm px-4 py-2.5 rounded-xl transition-all flex-shrink-0 w-full sm:w-auto"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Data
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Order", value: counts.ALL, color: "text-white" },
          { label: "Menunggu", value: counts.PENDING, color: "text-amber-400" },
          { label: "Selesai", value: counts.COMPLETED, color: "text-emerald-400" },
          { label: "Dibatal", value: counts.CANCELLED, color: "text-zinc-500" },
        ].map((item) => (
          <div key={item.label} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className="text-xs font-medium text-zinc-500 mb-1">{item.label}</p>
            <p className={`text-3xl font-black ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 overflow-x-auto hide-scrollbar w-full sm:w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 flex items-center ${
              activeTab === tab.key
                ? "bg-amber-500 text-black shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab.label}
            <CountBadge count={counts[tab.key]} active={activeTab === tab.key} />
          </button>
        ))}
      </div>

      {/* Orders List */}
      {pageLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl mb-4">
            📋
          </div>
          <p className="text-zinc-300 font-bold">Tidak ada transaksi</p>
          <p className="text-zinc-600 text-sm mt-1">Belum ada order {activeTab !== "ALL" ? `berstatus ${activeTab}` : ""}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOrders.map((order) => (
            <ManagerOrderCard
              key={order.id}
              order={order}
              menuMap={menuMap}
              isUpdating={updatingId === order.id}
              onUpdateStatus={handleUpdateStatus}
            />
          ))}
        </div>
      )}

      {!pageLoading && filteredOrders.length > 0 && (
        <p className="text-center text-zinc-600 text-xs mt-6">{filteredOrders.length} transaksi ditampilkan</p>
      )}
    </div>
  );
}