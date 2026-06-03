// "use client";

// import { useEffect, useState } from "react";
// import { apiRequest } from "@/utils/api";
// import { useRouter } from "next/navigation";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   stock: number;
//   isAvailable: boolean;
//   categoryId: number;
//   quantity: number;
// }

// function getCart(): CartItem[] {
//   try {
//     return JSON.parse(localStorage.getItem("cafe_cart") || "[]");
//   } catch {
//     return [];
//   }
// }

// function saveCart(cart: CartItem[]) {
//   localStorage.setItem("cafe_cart", JSON.stringify(cart));
//   window.dispatchEvent(new Event("cart_updated"));
// }

// export default function CustomerCartPage() {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setCart(getCart());
//     setMounted(true);
//   }, []);

//   const updateQty = (id: number, delta: number) => {
//     const updated = cart.map((item) => {
//       if (item.id !== id) return item;
//       const next = item.quantity + delta;
//       if (next < 1 || next > item.stock) return item;
//       return { ...item, quantity: next };
//     });
//     setCart(updated);
//     saveCart(updated);
//   };

//   const removeItem = (id: number) => {
//     const updated = cart.filter((item) => item.id !== id);
//     setCart(updated);
//     saveCart(updated);
//   };

//   const grandTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

//   const handleCheckout = async () => {
//     if (cart.length === 0) return;
//     setLoading(true);
//     try {
//       // POST /orders — userId diambil otomatis dari token JWT di backend
//       await apiRequest("/orders", {
//         method: "POST",
//         body: JSON.stringify({
//           items: cart.map((item) => ({
//             menuId: item.id,
//             quantity: item.quantity,
//           })),
//         }),
//       });
//       localStorage.removeItem("cafe_cart");
//       window.dispatchEvent(new Event("cart_updated"));
//       router.push("/customer/history");
//     } catch (err: any) {
//       alert(err.message || "Gagal checkout pesanan.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div className="space-y-6 p-1 max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => router.back()}
//           className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-all"
//         >
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <div>
//           <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500">Checkout</p>
//           <h2 className="text-2xl font-black text-white tracking-tight">Keranjang</h2>
//         </div>
//         {cart.length > 0 && (
//           <span className="ml-auto text-xs text-zinc-500 font-medium bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full">
//             {totalItems} item
//           </span>
//         )}
//       </div>

//       {cart.length === 0 ? (
//         /* Empty state */
//         <div className="flex flex-col items-center justify-center py-24 text-center">
//           <div className="relative w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-3xl mb-5">
//             🛒
//           </div>
//           <p className="text-zinc-200 font-bold text-lg">Keranjang kosong</p>
//           <p className="text-zinc-600 text-sm mt-1 mb-6">Belum ada item yang dipilih.</p>
//           <button
//             onClick={() => router.push("/customer")}
//             className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20"
//           >
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//             </svg>
//             Lihat Menu
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {/* Cart items */}
//           <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
//             {cart.map((item, idx) => (
//               <div
//                 key={item.id}
//                 className="p-5 flex items-center gap-4 hover:bg-white/[0.03] transition"
//                 style={{ animationDelay: `${idx * 40}ms` }}
//               >
//                 {/* Avatar initial */}
//                 <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-lg flex-shrink-0">
//                   {item.name.charAt(0).toUpperCase()}
//                 </div>

//                 {/* Info */}
//                 <div className="flex-1 min-w-0">
//                   <p className="font-bold text-white text-sm truncate">{item.name}</p>
//                   <p className="text-xs text-zinc-500 mt-0.5">
//                     Rp {item.price.toLocaleString("id-ID")} / item
//                   </p>
//                   <p className="text-xs font-bold text-amber-400 mt-1">
//                     Subtotal: Rp {(item.price * item.quantity).toLocaleString("id-ID")}
//                   </p>
//                 </div>

//                 {/* Qty controls */}
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   <button
//                     onClick={() => (item.quantity === 1 ? removeItem(item.id) : updateQty(item.id, -1))}
//                     className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-all ${
//                       item.quantity === 1
//                         ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
//                         : "bg-white/[0.06] text-zinc-300 hover:bg-white/10"
//                     }`}
//                   >
//                     {item.quantity === 1 ? (
//                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     ) : "−"}
//                   </button>
//                   <span className="text-white font-black text-sm w-6 text-center tabular-nums">{item.quantity}</span>
//                   <button
//                     onClick={() => updateQty(item.id, 1)}
//                     disabled={item.quantity >= item.stock}
//                     className="w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed font-black text-sm flex items-center justify-center transition-all"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-5">
//             <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ringkasan Pesanan</h3>

//             {/* Line items summary */}
//             <div className="space-y-2.5">
//               {cart.map((item) => (
//                 <div key={item.id} className="flex justify-between items-center">
//                   <span className="text-sm text-zinc-400 truncate flex-1 mr-4">
//                     {item.name}
//                     <span className="text-zinc-600 ml-1.5">×{item.quantity}</span>
//                   </span>
//                   <span className="text-sm font-semibold text-zinc-300 flex-shrink-0">
//                     Rp {(item.price * item.quantity).toLocaleString("id-ID")}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Divider */}
//             <div className="border-t border-white/[0.08] pt-4 flex justify-between items-center">
//               <span className="text-sm font-bold text-zinc-400">Total Pembayaran</span>
//               <span className="text-2xl font-black text-amber-400">
//                 Rp {grandTotal.toLocaleString("id-ID")}
//               </span>
//             </div>

//             {/* Checkout button */}
//             <button
//               onClick={handleCheckout}
//               disabled={loading}
//               className="w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-black py-4 rounded-xl text-sm transition-all hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-0.5 active:scale-[0.99]"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
//                   Mengirim pesanan...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                   </svg>
//                   Kirim Pesanan ke Dapur
//                 </>
//               )}
//             </button>

//             <p className="text-center text-zinc-600 text-xs">
//               Pesanan akan diproses setelah dikonfirmasi kasir.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











// "use client";

// import { useEffect, useState } from "react";
// import { apiRequest } from "@/utils/api";
// import { useRouter } from "next/navigation";

// interface CartItem {
//   id: number;
//   name: string;
//   price: number;
//   stock: number;
//   isAvailable: boolean;
//   categoryId: number;
//   quantity: number;
// }

// function getCart(): CartItem[] {
//   try {
//     return JSON.parse(localStorage.getItem("cafe_cart") || "[]");
//   } catch {
//     return [];
//   }
// }

// function saveCart(cart: CartItem[]) {
//   localStorage.setItem("cafe_cart", JSON.stringify(cart));
//   window.dispatchEvent(new Event("cart_updated"));
// }

// export default function CustomerCartPage() {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState<string>(""); // State baru untuk metode pembayaran
//   const router = useRouter();

//   useEffect(() => {
//     setCart(getCart());
//     setMounted(true);
//   }, []);

//   const updateQty = (id: number, delta: number) => {
//     const updated = cart.map((item) => {
//       if (item.id !== id) return item;
//       const next = item.quantity + delta;
//       if (next < 1 || next > item.stock) return item;
//       return { ...item, quantity: next };
//     });
//     setCart(updated);
//     saveCart(updated);
//   };

//   const removeItem = (id: number) => {
//     const updated = cart.filter((item) => item.id !== id);
//     setCart(updated);
//     saveCart(updated);
//   };

//   const grandTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
//   const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

//   const handleCheckout = async () => {
//     if (cart.length === 0) return;

//     // Validasi input metode pembayaran sebelum dikirim ke API
//     if (!paymentMethod) {
//       alert("Silakan pilih metode pembayaran terlebih dahulu!");
//       return;
//     }

//     setLoading(true);
//     try {
//       // Mengirim payload lengkap dengan key paymentMethod sesuai kebutuhan backend
//       await apiRequest("/orders", {
//         method: "POST",
//         body: JSON.stringify({
//           paymentMethod: paymentMethod, 
//           items: cart.map((item) => ({
//             menuId: item.id,
//             quantity: item.quantity,
//           })),
//         }),
//       });

//       localStorage.removeItem("cafe_cart");
//       window.dispatchEvent(new Event("cart_updated"));
//       router.push("/customer/history");
//     } catch (err: any) {
//       alert(err.message || "Gagal checkout pesanan.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!mounted) return null;

//   return (
//     <div className="space-y-6 p-1 max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="flex items-center gap-4">
//         <button
//           onClick={() => router.back()}
//           className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-all"
//         >
//           <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//             <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//           </svg>
//         </button>
//         <div>
//           <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500">Checkout</p>
//           <h2 className="text-2xl font-black text-white tracking-tight">Keranjang</h2>
//         </div>
//         {cart.length > 0 && (
//           <span className="ml-auto text-xs text-zinc-500 font-medium bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full">
//             {totalItems} item
//           </span>
//         )}
//       </div>

//       {cart.length === 0 ? (
//         /* Empty state */
//         <div className="flex flex-col items-center justify-center py-24 text-center">
//           <div className="relative w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-3xl mb-5">
//             🛒
//           </div>
//           <p className="text-zinc-200 font-bold text-lg">Keranjang kosong</p>
//           <p className="text-zinc-600 text-sm mt-1 mb-6">Belum ada item yang dipilih.</p>
//           <button
//             onClick={() => router.push("/customer")}
//             className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20"
//           >
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
//             </svg>
//             Lihat Menu
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {/* Cart items */}
//           <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
//             {cart.map((item, idx) => (
//               <div
//                 key={item.id}
//                 className="p-5 flex items-center gap-4 hover:bg-white/[0.03] transition"
//                 style={{ animationDelay: `${idx * 40}ms` }}
//               >
//                 {/* Avatar initial */}
//                 <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-lg flex-shrink-0">
//                   {item.name.charAt(0).toUpperCase()}
//                 </div>

//                 {/* Info */}
//                 <div className="flex-1 min-w-0">
//                   <p className="font-bold text-white text-sm truncate">{item.name}</p>
//                   <p className="text-xs text-zinc-500 mt-0.5">
//                     Rp {item.price.toLocaleString("id-ID")} / item
//                   </p>
//                   <p className="text-xs font-bold text-amber-400 mt-1">
//                     Subtotal: Rp {(item.price * item.quantity).toLocaleString("id-ID")}
//                   </p>
//                 </div>

//                 {/* Qty controls */}
//                 <div className="flex items-center gap-2 flex-shrink-0">
//                   <button
//                     onClick={() => (item.quantity === 1 ? removeItem(item.id) : updateQty(item.id, -1))}
//                     className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-all ${
//                       item.quantity === 1
//                         ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
//                         : "bg-white/[0.06] text-zinc-300 hover:bg-white/10"
//                     }`}
//                   >
//                     {item.quantity === 1 ? (
//                       <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                       </svg>
//                     ) : "−"}
//                   </button>
//                   <span className="text-white font-black text-sm w-6 text-center tabular-nums">{item.quantity}</span>
//                   <button
//                     onClick={() => updateQty(item.id, 1)}
//                     disabled={item.quantity >= item.stock}
//                     className="w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed font-black text-sm flex items-center justify-center transition-all"
//                   >
//                     +
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Metode Pembayaran Section */}
//           <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
//             <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pilih Metode Pembayaran</h3>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod("CASH")}
//                 className={`p-4 rounded-xl border text-left transition-all ${
//                   paymentMethod === "CASH"
//                     ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-md shadow-amber-500/5"
//                     : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20"
//                 }`}
//               >
//                 <p className="font-bold text-sm text-white">Tunai (Cash)</p>
//                 <p className="text-xs text-zinc-500 mt-1">Bayar langsung di kasir</p>
//               </button>

//               <button
//                 type="button"
//                 onClick={() => setPaymentMethod("QRIS")}
//                 className={`p-4 rounded-xl border text-left transition-all ${
//                   paymentMethod === "QRIS"
//                     ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-md shadow-amber-500/5"
//                     : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20"
//                 }`}
//               >
//                 <p className="font-bold text-sm text-white">QRIS / Digital</p>
//                 <p className="text-xs text-zinc-500 mt-1">Scan QR Code cashless</p>
//               </button>
//             </div>
//           </div>

//           {/* Order Summary */}
//           <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-5">
//             <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ringkasan Pesanan</h3>

//             {/* Line items summary */}
//             <div className="space-y-2.5">
//               {cart.map((item) => (
//                 <div key={item.id} className="flex justify-between items-center">
//                   <span className="text-sm text-zinc-400 truncate flex-1 mr-4">
//                     {item.name}
//                     <span className="text-zinc-600 ml-1.5">×{item.quantity}</span>
//                   </span>
//                   <span className="text-sm font-semibold text-zinc-300 flex-shrink-0">
//                     Rp {(item.price * item.quantity).toLocaleString("id-ID")}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             {/* Divider */}
//             <div className="border-t border-white/[0.08] pt-4 flex justify-between items-center">
//               <span className="text-sm font-bold text-zinc-400">Total Pembayaran</span>
//               <span className="text-2xl font-black text-amber-400">
//                 Rp {grandTotal.toLocaleString("id-ID")}
//               </span>
//             </div>

//             {/* Checkout button */}
//             <button
//               onClick={handleCheckout}
//               disabled={loading}
//               className="w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-black py-4 rounded-xl text-sm transition-all hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-0.5 active:scale-[0.99]"
//             >
//               {loading ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
//                   Mengirim pesanan...
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
//                   </svg>
//                   Kirim Pesanan ke Dapur
//                 </>
//               )}
//             </button>

//             <p className="text-center text-zinc-600 text-xs">
//               Pesanan akan diproses setelah dikonfirmasi kasir.
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }







"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";
import { useRouter } from "next/navigation";

interface CartItem {
  id: number;
  name: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  categoryId: number;
  quantity: number;
}

function getCart(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem("cafe_cart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart: CartItem[]) {
  localStorage.setItem("cafe_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart_updated"));
}

export default function CustomerCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // State untuk form
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    setCart(getCart());
    setMounted(true);
  }, []);

  const updateQty = (id: number, delta: number) => {
    const updated = cart.map((item) => {
      if (item.id !== id) return item;
      const next = item.quantity + delta;
      if (next < 1 || next > item.stock) return item;
      return { ...item, quantity: next };
    });
    setCart(updated);
    saveCart(updated);
  };

  const removeItem = (id: number) => {
    const updated = cart.filter((item) => item.id !== id);
    setCart(updated);
    saveCart(updated);
  };

  const grandTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;

    if (!paymentMethod) {
      alert("Silakan pilih metode pembayaran terlebih dahulu!");
      return;
    }

    setLoading(true);
    try {
      await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify({
          paymentMethod: paymentMethod,
          items: cart.map((item) => ({
            menuId: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      localStorage.removeItem("cafe_cart");
      window.dispatchEvent(new Event("cart_updated"));
      router.push("/customer/history");
    } catch (err: any) {
      alert(err.message || "Gagal checkout pesanan.");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="space-y-6 p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/10 border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:text-white transition-all"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500">Checkout</p>
          <h2 className="text-2xl font-black text-white tracking-tight">Keranjang</h2>
        </div>
        {cart.length > 0 && (
          <span className="ml-auto text-xs text-zinc-500 font-medium bg-white/[0.04] border border-white/[0.06] px-3 py-1.5 rounded-full">
            {totalItems} item
          </span>
        )}
      </div>

      {cart.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="relative w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-3xl mb-5">
            🛒
          </div>
          <p className="text-zinc-200 font-bold text-lg">Keranjang kosong</p>
          <p className="text-zinc-600 text-sm mt-1 mb-6">Belum ada item yang dipilih.</p>
          <button
            onClick={() => router.push("/customer")}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all hover:shadow-lg hover:shadow-amber-500/20"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Lihat Menu
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cart items */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden divide-y divide-white/[0.06]">
            {cart.map((item, idx) => (
              <div
                key={item.id}
                className="p-5 flex items-center gap-4 hover:bg-white/[0.03] transition"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                {/* Avatar initial */}
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-black text-lg flex-shrink-0">
                  {item.name.charAt(0).toUpperCase()}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white text-sm truncate">{item.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Rp {item.price.toLocaleString("id-ID")} / item
                  </p>
                  <p className="text-xs font-bold text-amber-400 mt-1">
                    Subtotal: Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => (item.quantity === 1 ? removeItem(item.id) : updateQty(item.id, -1))}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm transition-all ${item.quantity === 1
                        ? "bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white"
                        : "bg-white/[0.06] text-zinc-300 hover:bg-white/10"
                      }`}
                  >
                    {item.quantity === 1 ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    ) : "−"}
                  </button>
                  <span className="text-white font-black text-sm w-6 text-center tabular-nums">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.id, 1)}
                    disabled={item.quantity >= item.stock}
                    className="w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed font-black text-sm flex items-center justify-center transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Metode Pembayaran Section */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pilih Metode Pembayaran</h3>
            {/* Diubah menjadi grid-cols-3 agar 3 menu tertata rapi di layar medium ke atas */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("CASH")}
                className={`p-4 rounded-xl border text-left transition-all ${paymentMethod === "CASH"
                    ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-md shadow-amber-500/5"
                    : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20"
                  }`}
              >
                <p className="font-bold text-sm text-white">Tunai (Cash)</p>
                <p className="text-xs text-zinc-500 mt-1">Bayar langsung di kasir</p>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("QRIS")}
                className={`p-4 rounded-xl border text-left transition-all ${paymentMethod === "QRIS"
                    ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-md shadow-amber-500/5"
                    : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20"
                  }`}
              >
                <p className="font-bold text-sm text-white">QRIS / Digital</p>
                <p className="text-xs text-zinc-500 mt-1">Scan QR Code cashless</p>
              </button>

              {/* Tambahan metode BANK_TRANSFER */}
              <button
                type="button"
                onClick={() => setPaymentMethod("BANK_TRANSFER")}
                className={`p-4 rounded-xl border text-left transition-all ${paymentMethod === "BANK_TRANSFER"
                    ? "bg-amber-500/10 border-amber-500 text-amber-400 shadow-md shadow-amber-500/5"
                    : "bg-white/[0.02] border-white/10 text-zinc-400 hover:border-white/20"
                  }`}
              >
                <p className="font-bold text-sm text-white">Transfer Bank</p>
                <p className="text-xs text-zinc-500 mt-1">Via Virtual Account</p>
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Ringkasan Pesanan</h3>

            {/* Line items summary */}
            <div className="space-y-2.5">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <span className="text-sm text-zinc-400 truncate flex-1 mr-4">
                    {item.name}
                    <span className="text-zinc-600 ml-1.5">×{item.quantity}</span>
                  </span>
                  <span className="text-sm font-semibold text-zinc-300 flex-shrink-0">
                    Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                  </span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-white/[0.08] pt-4 flex justify-between items-center">
              <span className="text-sm font-bold text-zinc-400">Total Pembayaran</span>
              <span className="text-2xl font-black text-amber-400">
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-black py-4 rounded-xl text-sm transition-all hover:shadow-xl hover:shadow-amber-500/25 hover:-translate-y-0.5 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Mengirim pesanan...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Kirim Pesanan ke Dapur
                </>
              )}
            </button>

            <p className="text-center text-zinc-600 text-xs">
              Pesanan akan diproses setelah dikonfirmasi kasir.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}