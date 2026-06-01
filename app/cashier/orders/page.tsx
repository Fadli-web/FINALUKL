// "use client";

// import { useEffect, useState } from "react";
// import { apiRequest } from "@/utils/api";

// export default function CashierOrdersPage() {
//   const [orders, setOrders] = useState<any[]>([]);
//   const [menus, setMenus] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   const fetchOrders = async () => {
//     try {
//       const [orderRes, menuRes] = await Promise.all([
//         apiRequest("/orders"), // Mengambil semua transaksi kafe
//         apiRequest("/menus")
//       ]);
//       const sorted = (orderRes.data || []).sort((a: any, b: any) => b.id - a.id);
//       setOrders(sorted);
//       setMenus(menuRes.data || []);
//     } catch (err) {
//       console.error("Gagal memuat antrean order", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//     // Opsional: Polling tiap 10 detik agar kasir dapet order baru secara otomatis
//     const interval = setInterval(fetchOrders, 10000);
//     return () => clearInterval(interval);
//   }, []);

//   // Toleransi properti data backend
//   const getOrderItems = (order: any): any[] => {
//     return order.items || order.order_items || order.detail_order || order.order_detail || [];
//   };

//   // Logika Kasir update status
//   const updateStatus = async (orderId: number, targetStatus: "COMPLETED" | "CANCELLED") => {
//     if (!confirm(`Tandai order #${orderId} sebagai ${targetStatus}?`)) return;
//     try {
//       await apiRequest(`/orders/${orderId}/status`, {
//         method: "PUT",
//         body: JSON.stringify({ status: targetStatus })
//       });
//       fetchOrders(); // Refresh data instan
//     } catch (err: any) {
//       alert(err.message || "Gagal mengubah status");
//     }
//   };

//   if (loading) return <div className="p-8 text-center text-zinc-400 animate-pulse">Memuat Antrean Dapur...</div>;

//   return (
//     <div className="max-w-6xl mx-auto space-y-6 text-zinc-900">
//       <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
//         <div>
//           <h2 className="text-2xl font-black tracking-tight">🧑‍🍳 Live Kitchen & Antrean</h2>
//           <p className="text-xs text-zinc-500 mt-1">Selesaikan pesanan ketika hidangan sudah siap diantarkan.</p>
//         </div>
//         <button onClick={fetchOrders} className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold px-4 py-2.5 rounded-xl text-sm transition-all shadow-sm">
//           🔄 Refresh
//         </button>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
//         {orders.map(order => {
//           const items = getOrderItems(order);
//           const isPending = order.status === "PENDING";
          
//           return (
//             <div key={order.id} className={`p-5 rounded-3xl border transition-all shadow-sm flex flex-col justify-between ${isPending ? "bg-white border-amber-200 ring-2 ring-amber-500/10" : "bg-zinc-50 border-zinc-200 opacity-80"}`}>
//               <div>
//                 <div className="flex justify-between items-start border-b border-zinc-100 pb-3 mb-3">
//                   <div>
//                     <h3 className="font-black text-lg">Order #{order.id}</h3>
//                     <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Pelanggan ID: {order.userId || "GUEST"}</p>
//                   </div>
//                   <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${
//                     order.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
//                     order.status === "PENDING" ? "bg-amber-100 text-amber-700 border-amber-300" : 
//                     "bg-rose-50 text-rose-700 border-rose-200"
//                   }`}>
//                     {order.status}
//                   </span>
//                 </div>

//                 <div className="space-y-1.5 mb-5">
//                   {items.map((item: any, idx: number) => {
//                     const matchMenu = item.menu || menus.find(m => m.id === (item.menuId || item.menu_id));
//                     return (
//                       <div key={idx} className="flex justify-between items-center text-sm">
//                         <span className="font-bold text-zinc-700">{matchMenu?.name || `Produk #${item.menuId || item.menu_id}`}</span>
//                         <span className="font-black text-zinc-900 bg-zinc-200/50 px-2 rounded">x{item.quantity}</span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* ACTION BUTTONS: Hanya muncul jika order masih PENDING */}
//               {isPending ? (
//                 <div className="grid grid-cols-2 gap-2 pt-4 border-t border-zinc-100">
//                   <button 
//                     onClick={() => updateStatus(order.id, "CANCELLED")}
//                     className="bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 font-bold py-2.5 rounded-xl text-xs transition-all"
//                   >
//                     Batalkan Order
//                   </button>
//                   <button 
//                     onClick={() => updateStatus(order.id, "COMPLETED")}
//                     className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 font-bold py-2.5 rounded-xl text-xs transition-all"
//                   >
//                     Tandai Selesai
//                   </button>
//                 </div>
//               ) : (
//                 <div className="pt-4 border-t border-zinc-100 text-center">
//                   <span className="text-xs font-bold text-zinc-400 italic">Transaksi sudah diarsipkan.</span>
//                 </div>
//               )}
//             </div>
//           );
//         })}
//         {orders.length === 0 && (
//           <div className="col-span-full bg-white p-12 text-center rounded-3xl border border-zinc-200 text-zinc-500 font-bold">
//             Tidak ada transaksi tercatat.
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";

export default function CashierOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "COMPLETED" | "CANCELLED">("ALL");

  const fetchOrders = async () => {
    try {
      const [orderRes, menuRes] = await Promise.all([
        apiRequest("/orders"),
        apiRequest("/menus"),
      ]);
      const sorted = (orderRes.data || []).sort(
        (a: any, b: any) => b.id - a.id
      );
      setOrders(sorted);
      setMenus(menuRes.data || []);
    } catch (err) {
      console.error("Gagal memuat antrean order", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const getOrderItems = (order: any): any[] =>
    order.items ||
    order.order_items ||
    order.detail_order ||
    order.order_detail ||
    [];

  const updateStatus = async (
    orderId: number,
    targetStatus: "COMPLETED" | "CANCELLED"
  ) => {
    if (!confirm(`Tandai order #${orderId} sebagai ${targetStatus}?`)) return;
    setUpdatingId(orderId);
    try {
      await apiRequest(`/orders/${orderId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: targetStatus }),
      });
      await fetchOrders();
    } catch (err: any) {
      alert(err.message || "Gagal mengubah status");
    } finally {
      setUpdatingId(null);
    }
  };

  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  const filteredOrders =
    filterStatus === "ALL"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  if (loading) {
    return (
      <div
        style={{ background: "#0d0a08" }}
        className="min-h-screen flex flex-col items-center justify-center gap-4"
      >
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" style={{ animationDuration: "1.5s" }} />
          <div className="absolute inset-2 rounded-full border-2 border-t-amber-500 border-amber-500/10 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🍳</div>
        </div>
        <p className="text-sm font-medium tracking-widest uppercase animate-pulse" style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}>
          Memuat Antrean Dapur...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ background: "#0d0a08", minHeight: "100vh", fontFamily: "'Georgia', serif" }}
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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#c8923a", fontFamily: "'Courier New', monospace" }}>
              ◈ Sistem Kasir / Antrean Dapur
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold leading-none" style={{ color: "#f5e6d0", letterSpacing: "-0.02em" }}>
              Live<br /><span style={{ color: "#c8923a" }}>Kitchen</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl border animate-pulse" style={{ background: "rgba(200,146,58,0.08)", borderColor: "rgba(200,146,58,0.3)" }}>
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-sm font-bold" style={{ color: "#c8923a", fontFamily: "'Courier New', monospace" }}>
                  {pendingCount} PENDING
                </span>
              </div>
            )}
            <button
              onClick={fetchOrders}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#c8b89a",
                fontFamily: "'Courier New', monospace",
              }}
            >
              <span className="text-base">↻</span> REFRESH
            </button>
          </div>
        </div>

        {/* ── DIVIDER ── */}
        <div className="h-px" style={{ background: "linear-gradient(to right, transparent, rgba(200,146,58,0.4), transparent)" }} />

        {/* ── FILTER TABS ── */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(["ALL", "PENDING", "COMPLETED", "CANCELLED"] as const).map((status) => {
            const count =
              status === "ALL"
                ? orders.length
                : orders.filter((o) => o.status === status).length;
            const isActive = filterStatus === status;
            const accent =
              status === "PENDING"
                ? "#c8923a"
                : status === "COMPLETED"
                ? "#10b981"
                : status === "CANCELLED"
                ? "#f43f5e"
                : "#f5e6d0";
            return (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all"
                style={{
                  background: isActive
                    ? `rgba(${status === "PENDING" ? "200,146,58" : status === "COMPLETED" ? "16,185,129" : status === "CANCELLED" ? "244,63,94" : "245,230,208"},0.12)`
                    : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isActive ? `${accent}50` : "rgba(255,255,255,0.06)"}`,
                  color: isActive ? accent : "#8a7560",
                  fontFamily: "'Courier New', monospace",
                }}
              >
                {status === "ALL" ? "SEMUA" : status}
                <span
                  className="px-1.5 py-0.5 rounded-md text-[10px]"
                  style={{
                    background: isActive ? `${accent}30` : "rgba(255,255,255,0.06)",
                    color: isActive ? accent : "#8a7560",
                  }}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── ORDER CARDS GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOrders.map((order) => {
            const items = getOrderItems(order);
            const isPending = order.status === "PENDING";
            const isUpdating = updatingId === order.id;

            const statusColor =
              order.status === "COMPLETED"
                ? "#10b981"
                : order.status === "PENDING"
                ? "#c8923a"
                : "#f43f5e";

            return (
              <div
                key={order.id}
                className="rounded-2xl border flex flex-col overflow-hidden transition-all duration-200"
                style={{
                  background: isPending
                    ? "rgba(200,146,58,0.04)"
                    : "rgba(255,255,255,0.02)",
                  borderColor: isPending
                    ? "rgba(200,146,58,0.25)"
                    : "rgba(255,255,255,0.06)",
                  boxShadow: isPending
                    ? "0 0 24px rgba(200,146,58,0.08)"
                    : "none",
                  opacity: order.status === "CANCELLED" ? 0.6 : 1,
                }}
              >
                {/* Card Header */}
                <div
                  className="px-5 py-4 flex items-center justify-between border-b"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <div>
                    <h3
                      className="font-bold text-base"
                      style={{ color: "#f5e6d0", fontFamily: "'Courier New', monospace" }}
                    >
                      #ORDER-{order.id}
                    </h3>
                    <p
                      className="text-[10px] mt-0.5 tracking-widest uppercase"
                      style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}
                    >
                      {order.userId ? `Member ID: ${order.userId}` : "Pelanggan Umum"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] font-bold border tracking-widest uppercase"
                      style={{
                        background: `${statusColor}15`,
                        borderColor: `${statusColor}40`,
                        color: statusColor,
                        fontFamily: "'Courier New', monospace",
                      }}
                    >
                      {order.status}
                    </span>
                    {isPending && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </div>
                </div>

                {/* Items List */}
                <div className="px-5 py-4 flex-1 space-y-2">
                  {items.length === 0 && (
                    <p className="text-xs italic" style={{ color: "#8a7560" }}>
                      — Data item tidak tersedia —
                    </p>
                  )}
                  {items.map((item: any, idx: number) => {
                    const matchMenu =
                      item.menu ||
                      menus.find(
                        (m) => m.id === (item.menuId || item.menu_id)
                      );
                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between"
                      >
                        <span
                          className="text-sm"
                          style={{ color: "#c8b89a", fontFamily: "'Georgia', serif" }}
                        >
                          {matchMenu?.name ||
                            `Produk #${item.menuId || item.menu_id}`}
                        </span>
                        <div
                          className="flex items-center gap-1 px-2 py-0.5 rounded-md"
                          style={{ background: "rgba(200,146,58,0.12)", border: "1px solid rgba(200,146,58,0.2)" }}
                        >
                          <span className="text-[10px]" style={{ color: "#8a7560" }}>×</span>
                          <span
                            className="text-xs font-bold"
                            style={{ color: "#c8923a", fontFamily: "'Courier New', monospace" }}
                          >
                            {item.quantity}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                {isPending ? (
                  <div
                    className="px-5 pb-5 pt-3 grid grid-cols-2 gap-2 border-t"
                    style={{ borderColor: "rgba(255,255,255,0.05)" }}
                  >
                    <button
                      onClick={() => updateStatus(order.id, "CANCELLED")}
                      disabled={isUpdating}
                      className="py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                      style={{
                        background: "rgba(244,63,94,0.08)",
                        border: "1px solid rgba(244,63,94,0.25)",
                        color: "#f43f5e",
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: "0.05em",
                      }}
                    >
                      ✕ BATALKAN
                    </button>
                    <button
                      onClick={() => updateStatus(order.id, "COMPLETED")}
                      disabled={isUpdating}
                      className="py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                      style={{
                        background: "linear-gradient(135deg, #059669, #10b981)",
                        color: "#fff",
                        fontFamily: "'Courier New', monospace",
                        letterSpacing: "0.05em",
                        boxShadow: "0 4px 12px rgba(16,185,129,0.25)",
                      }}
                    >
                      {isUpdating ? "..." : "✓ SELESAI"}
                    </button>
                  </div>
                ) : (
                  <div
                    className="px-5 pb-4 pt-3 border-t"
                    style={{ borderColor: "rgba(255,255,255,0.05)" }}
                  >
                    <p
                      className="text-center text-[10px] tracking-widest uppercase"
                      style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}
                    >
                      — Transaksi Diarsipkan —
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {filteredOrders.length === 0 && (
            <div
              className="col-span-full py-20 text-center rounded-2xl border"
              style={{
                background: "rgba(255,255,255,0.02)",
                borderColor: "rgba(255,255,255,0.06)",
              }}
            >
              <div className="text-5xl mb-4">☕</div>
              <p className="text-sm tracking-widest uppercase" style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}>
                — Tidak ada transaksi tercatat —
              </p>
            </div>
          )}
        </div>

        {/* Footer ornament */}
        <div className="flex items-center justify-center gap-4 pt-4">
          <div className="h-px w-16" style={{ background: "rgba(200,146,58,0.3)" }} />
          <span className="text-amber-700 text-lg">◈</span>
          <div className="h-px w-16" style={{ background: "rgba(200,146,58,0.3)" }} />
        </div>
      </div>
    </div>
  );
}