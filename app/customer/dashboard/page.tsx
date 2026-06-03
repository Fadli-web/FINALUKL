"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";

interface Menu {
  id: number;
  name: string;
  price: number;
  stock: number;
  isAvailable: boolean;
  categoryId: number;
  imageUrl?: string | null; // Tambahan field gambar
}

interface Category {
  id: number;
  name: string;
}

interface CartItem extends Menu {
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
}

// Dispatch custom event so cart badge updates without page reload
function dispatchCartUpdate() {
  window.dispatchEvent(new Event("cart_updated"));
}

function getCartQty(cart: CartItem[], menuId: number): number {
  return cart.find((i) => i.id === menuId)?.quantity || 0;
}

export default function CustomerDashboard() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<number | "ALL">("ALL");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [addedId, setAddedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setCart(getCart());
    async function loadCatalog() {
      try {
        const [menuRes, catRes] = await Promise.all([
          apiRequest("/menus"),
          apiRequest("/categories"),
        ]);
        setMenus(menuRes.data || []);
        setCategories(catRes.data || []);
      } catch {
        console.error("Gagal sinkronisasi produk");
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const handleAddToCart = (product: Menu) => {
    const current = getCart();
    const idx = current.findIndex((i) => i.id === product.id);
    if (idx > -1) {
      if (current[idx].quantity >= product.stock) return;
      current[idx].quantity += 1;
    } else {
      current.push({ ...product, quantity: 1 });
    }
    saveCart(current);
    setCart([...current]);
    dispatchCartUpdate();
    // Feedback animation
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 800);
  };

  const handleRemoveOne = (product: Menu) => {
    const current = getCart();
    const idx = current.findIndex((i) => i.id === product.id);
    if (idx === -1) return;
    if (current[idx].quantity <= 1) {
      current.splice(idx, 1);
    } else {
      current[idx].quantity -= 1;
    }
    saveCart(current);
    setCart([...current]);
    dispatchCartUpdate();
  };

  const totalCartItems = cart.reduce((s, i) => s + i.quantity, 0);

  const filteredMenus = menus
    .filter((m) => (selectedCategory === "ALL" ? true : m.categoryId === selectedCategory))
    .filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const availableMenus = filteredMenus.filter((m) => m.isAvailable && m.stock > 0);
  const unavailableMenus = filteredMenus.filter((m) => !m.isAvailable || m.stock <= 0);
  const sortedMenus = [...availableMenus, ...unavailableMenus];

  return (
    <div className="space-y-6 p-1">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900 via-[#1a1208] to-zinc-900 p-7 md:p-10 border border-amber-500/10">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 right-12 w-56 h-56 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Menu Hari Ini
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Mau Ngopi <span className="text-amber-400">Apa</span> Hari Ini?
            </h1>
            <p className="text-zinc-400 text-sm">
              Pilih menu favoritmu — langsung dari meja, tanpa antre di kasir.
            </p>
          </div>

          {totalCartItems > 0 && (
            <a
              href="/customer/cart"
              className="flex-shrink-0 flex items-center gap-3 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-3.5 rounded-2xl transition-all hover:shadow-xl hover:shadow-amber-500/30 hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Keranjang
              <span className="bg-black/20 text-white text-xs font-black w-6 h-6 rounded-full flex items-center justify-center">
                {totalCartItems}
              </span>
            </a>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Cari menu..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 rounded-2xl pl-11 pr-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[{ id: "ALL" as const, name: "Semua" }, ...categories].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex-shrink-0 ${selectedCategory === cat.id
              ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20"
              : "bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:border-white/20 hover:text-zinc-200"
              }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
          ))}
        </div>
      ) : sortedMenus.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl mb-4">
            ☕
          </div>
          <p className="text-zinc-300 font-bold">Menu tidak ditemukan</p>
          <p className="text-zinc-600 text-sm mt-1">Coba kategori atau kata kunci lain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedMenus.map((menu) => {
            const isUnavailable = !menu.isAvailable || menu.stock <= 0;
            const qtyInCart = getCartQty(cart, menu.id);
            const isAdding = addedId === menu.id;

            return (
              <div
                key={menu.id}
                className={`group relative flex flex-col rounded-2xl border overflow-hidden transition-all duration-300 ${isUnavailable
                  ? "bg-white/[0.02] border-white/[0.05] opacity-50 grayscale-[0.5]"
                  : "bg-white/[0.04] hover:bg-white/[0.07] border-white/[0.08] hover:border-amber-500/25 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50"
                  }`}
              >
                {/* --- Bagian Gambar Menu --- */}
                <div className="relative h-44 w-full bg-zinc-800 border-b border-white/[0.05] overflow-hidden">
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        // Fallback jika gambar gagal dimuat
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300/18181b/3f3f46?text=No+Image";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-zinc-600 bg-white/[0.02]">
                      <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-[10px] font-medium tracking-wider uppercase opacity-50">No Image</span>
                    </div>
                  )}

                  {/* Badges melayang di atas gambar */}
                  <div className="absolute top-3 left-3 right-3 flex items-start justify-between pointer-events-none">
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-400 px-2.5 py-1 rounded-md shadow-lg backdrop-blur-md">
                      {categories.find((c) => c.id === menu.categoryId)?.name || "Menu"}
                    </span>
                    
                    <div className="flex flex-col gap-1.5 items-end">
                      {isUnavailable && (
                        <span className="text-[10px] font-black text-white bg-red-600/90 backdrop-blur-md px-2 py-1 rounded-md shadow-lg border border-red-500/50">
                          HABIS
                        </span>
                      )}
                      {!isUnavailable && menu.stock <= 10 && (
                        <span className="text-[10px] font-black text-red-100 bg-red-500/80 backdrop-blur-md border border-red-500/50 px-2 py-1 rounded-md shadow-lg">
                          Sisa {menu.stock}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {/* --- End Bagian Gambar --- */}

                {/* Konten Text & Aksi */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-white text-base leading-snug flex-1 line-clamp-2">
                    {menu.name}
                  </h3>

                  <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                    <span className="font-black text-amber-400 text-base">
                      Rp {menu.price.toLocaleString("id-ID")}
                    </span>

                    {isUnavailable ? (
                      <span className="text-xs text-zinc-600 font-medium">Tidak tersedia</span>
                    ) : qtyInCart === 0 ? (
                      <button
                        onClick={() => handleAddToCart(menu)}
                        className={`flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl transition-all duration-300 ${isAdding
                          ? "bg-emerald-500 text-white scale-95"
                          : "bg-amber-500 hover:bg-amber-400 text-black hover:shadow-lg hover:shadow-amber-500/20"
                          }`}
                      >
                        {isAdding ? (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                            Ditambah
                          </>
                        ) : (
                          <>
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Pesan
                          </>
                        )}
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 bg-white/[0.06] border border-white/10 rounded-xl px-2 py-1">
                        <button
                          onClick={() => handleRemoveOne(menu)}
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/[0.08] hover:bg-red-500/20 text-zinc-300 hover:text-red-400 font-black text-xs transition-all"
                        >
                          −
                        </button>
                        <span className="text-white font-black text-sm w-5 text-center tabular-nums">{qtyInCart}</span>
                        <button
                          onClick={() => handleAddToCart(menu)}
                          disabled={qtyInCart >= menu.stock}
                          className="w-6 h-6 flex items-center justify-center rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-400 hover:text-black disabled:opacity-30 font-black text-xs transition-all"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && sortedMenus.length > 0 && (
        <p className="text-center text-zinc-600 text-xs">{availableMenus.length} menu tersedia</p>
      )}
    </div>
  );
}