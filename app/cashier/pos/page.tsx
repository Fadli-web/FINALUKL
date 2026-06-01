"use client";

import { useEffect, useState, useCallback } from "react";
import { apiRequest } from "@/utils/api";

export default function CashierPOSPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [successAnim, setSuccessAnim] = useState(false);

  const [cart, setCart] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | "ALL">("ALL");
  const [customerId, setCustomerId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadCatalog() {
      try {
        const [menuRes, catRes] = await Promise.all([
          apiRequest("/menus"),
          apiRequest("/categories"),
        ]);
        setMenus(menuRes.data || []);
        setCategories(catRes.data || []);
      } catch (err) {
        console.error("Gagal memuat katalog", err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const addToCart = useCallback((menu: any) => {
    if (!menu.isAvailable || menu.stock < 1) return;
    setCart((prev) => {
      const existing = prev.find((item) => item.id === menu.id);
      if (existing) {
        if (existing.quantity >= menu.stock) return prev;
        return prev.map((item) =>
          item.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...menu, quantity: 1 }];
    });
  }, []);

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const next = item.quantity + delta;
        if (next < 1 || next > item.stock) return item;
        return { ...item, quantity: next };
      })
    );
  };

  const removeItem = (id: number) =>
    setCart((prev) => prev.filter((item) => item.id !== id));

  const clearCart = () => {
    setCart([]);
    setCustomerId("");
  };

  const grandTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckoutLoading(true);

    const payload: any = {
      items: cart.map((item) => ({ menuId: item.id, quantity: item.quantity })),
    };
    if (customerId.trim() !== "") {
      const parsed = Number(customerId);
      if (isNaN(parsed) || parsed <= 0) {
        alert("ID Member tidak valid. Masukkan angka positif atau kosongkan.");
        setCheckoutLoading(false);
        return;
      }
      payload.userId = parsed;
    }

    try {
      await apiRequest("/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setSuccessAnim(true);
      setTimeout(() => {
        setSuccessAnim(false);
        setCart([]);
        setCustomerId("");
      }, 1800);
    } catch (err: any) {
      alert(err.message || "Gagal membuat pesanan.");
    } finally {
      setCheckoutLoading(false);
    }
  };

  const filteredMenus = menus
    .filter((m) =>
      selectedCategory === "ALL" ? true : m.categoryId === selectedCategory
    )
    .filter((m) =>
      searchQuery.trim() === ""
        ? true
        : m.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (loading) {
    return (
      <div
        style={{ background: "#0d0a08" }}
        className="min-h-screen flex flex-col items-center justify-center gap-4"
      >
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-amber-500/20 animate-ping" style={{ animationDuration: "1.5s" }} />
          <div className="absolute inset-2 rounded-full border-2 border-t-amber-500 border-amber-500/10 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">🍽️</div>
        </div>
        <p className="text-sm font-medium tracking-widest uppercase animate-pulse" style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}>
          Menyiapkan Mesin POS...
        </p>
      </div>
    );
  }

  return (
    <div
      style={{ background: "#0d0a08", fontFamily: "'Georgia', serif" }}
      className="text-stone-100 h-screen flex flex-col overflow-hidden"
    >
      {/* Grain overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Success overlay */}
      {successAnim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(13,10,8,0.9)" }}>
          <div className="flex flex-col items-center gap-4">
            <div className="text-7xl animate-bounce">✅</div>
            <p className="text-xl font-bold tracking-widest" style={{ color: "#10b981", fontFamily: "'Courier New', monospace" }}>
              TRANSAKSI BERHASIL
            </p>
            <p className="text-sm" style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}>
              Pesanan masuk ke antrean dapur
            </p>
          </div>
        </div>
      )}

      {/* ── TOP NAV BAR ── */}
      <div
        className="relative z-10 flex items-center justify-between px-4 sm:px-6 py-3 border-b shrink-0"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(13,10,8,0.95)" }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">☕</span>
          <div>
            <h1 className="text-base font-bold leading-none" style={{ color: "#f5e6d0" }}>
              Point of Sales
            </h1>
            <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}>
              ◈ Mesin Kasir Aktif
            </p>
          </div>
        </div>
        {cart.length > 0 && (
          <div className="flex items-center gap-2 sm:hidden px-3 py-1.5 rounded-full" style={{ background: "rgba(200,146,58,0.15)", border: "1px solid rgba(200,146,58,0.3)" }}>
            <span className="text-xs font-bold" style={{ color: "#c8923a", fontFamily: "'Courier New', monospace" }}>
              {totalItems} item
            </span>
          </div>
        )}
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="relative z-10 flex flex-col lg:flex-row flex-1 overflow-hidden">

        {/* ── LEFT: CATALOG ── */}
        <div className="flex-1 flex flex-col overflow-hidden lg:border-r" style={{ borderColor: "rgba(255,255,255,0.06)" }}>

          {/* Search + Category Filter */}
          <div className="px-4 sm:px-5 pt-4 pb-3 space-y-3 shrink-0">
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "#f5e6d0",
                fontFamily: "'Courier New', monospace",
              }}
            />
            <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
              <button
                onClick={() => setSelectedCategory("ALL")}
                className="whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                style={{
                  background: selectedCategory === "ALL" ? "rgba(200,146,58,0.15)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${selectedCategory === "ALL" ? "rgba(200,146,58,0.4)" : "rgba(255,255,255,0.07)"}`,
                  color: selectedCategory === "ALL" ? "#c8923a" : "#8a7560",
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: "0.05em",
                }}
              >
                SEMUA
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all"
                  style={{
                    background: selectedCategory === cat.id ? "rgba(200,146,58,0.15)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${selectedCategory === cat.id ? "rgba(200,146,58,0.4)" : "rgba(255,255,255,0.07)"}`,
                    color: selectedCategory === cat.id ? "#c8923a" : "#8a7560",
                    fontFamily: "'Courier New', monospace",
                    letterSpacing: "0.05em",
                  }}
                >
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Grid */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-5 pb-4" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(200,146,58,0.2) transparent" }}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {filteredMenus.map((menu) => {
                const isUnavailable = !menu.isAvailable || menu.stock < 1;
                const inCart = cart.find((item) => item.id === menu.id);
                return (
                  <div
                    key={menu.id}
                    onClick={() => addToCart(menu)}
                    className={`p-4 rounded-2xl border relative overflow-hidden transition-all duration-200 ${isUnavailable ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:-translate-y-1 active:scale-95"}`}
                    style={{
                      background: inCart
                        ? "rgba(200,146,58,0.08)"
                        : "rgba(255,255,255,0.02)",
                      borderColor: inCart
                        ? "rgba(200,146,58,0.35)"
                        : "rgba(255,255,255,0.07)",
                      boxShadow: inCart ? "0 0 16px rgba(200,146,58,0.1)" : "none",
                    }}
                  >
                    {inCart && (
                      <div
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: "#c8923a", color: "#0d0a08", fontFamily: "'Courier New', monospace" }}
                      >
                        {inCart.quantity}
                      </div>
                    )}
                    {isUnavailable && (
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded text-[9px] font-bold" style={{ background: "rgba(244,63,94,0.2)", color: "#f43f5e", fontFamily: "'Courier New', monospace" }}>
                        HABIS
                      </div>
                    )}
                    <h3 className="font-semibold text-sm leading-tight pr-6" style={{ color: "#f5e6d0", fontFamily: "'Georgia', serif" }}>
                      {menu.name}
                    </h3>
                    <p className="font-bold text-sm mt-2" style={{ color: "#c8923a", fontFamily: "'Courier New', monospace" }}>
                      Rp {menu.price.toLocaleString("id-ID")}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[10px]" style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}>
                        Stok: {menu.stock}
                      </p>
                    </div>
                  </div>
                );
              })}
              {filteredMenus.length === 0 && (
                <div className="col-span-full py-16 text-center">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="text-sm" style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}>
                    Tidak ada menu ditemukan
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT: CART / RECEIPT ── */}
        <div
          className="lg:w-80 xl:w-96 flex flex-col shrink-0"
          style={{ background: "rgba(255,255,255,0.01)" }}
        >
          {/* Cart Header */}
          <div
            className="px-5 py-4 border-b flex items-center justify-between shrink-0"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <div>
              <h3 className="font-bold text-base" style={{ color: "#f5e6d0" }}>
                📝 Struk Pesanan
              </h3>
              <p className="text-[10px] tracking-widest uppercase mt-0.5" style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}>
                {totalItems} item · {cart.length} produk
              </p>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-[10px] px-3 py-1.5 rounded-lg transition-all hover:opacity-80"
                style={{
                  background: "rgba(244,63,94,0.08)",
                  border: "1px solid rgba(244,63,94,0.2)",
                  color: "#f43f5e",
                  fontFamily: "'Courier New', monospace",
                  letterSpacing: "0.05em",
                }}
              >
                HAPUS SEMUA
              </button>
            )}
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(200,146,58,0.2) transparent" }}>
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-12 gap-3">
                <div className="text-5xl opacity-30">🛒</div>
                <p className="text-xs text-center" style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}>
                  Pilih menu dari katalog<br />untuk memulai pesanan
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 pb-3 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.05)" }}
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium truncate" style={{ color: "#f5e6d0", fontFamily: "'Georgia', serif" }}>
                      {item.name}
                    </h4>
                    <p className="text-xs font-bold mt-0.5" style={{ color: "#c8923a", fontFamily: "'Courier New', monospace" }}>
                      Rp {(item.price * item.quantity).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <div
                    className="flex items-center rounded-lg overflow-hidden shrink-0"
                    style={{ border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQty(item.id, -1)
                          : removeItem(item.id)
                      }
                      className="w-7 h-7 flex items-center justify-center text-sm transition-colors"
                      style={{
                        background: "rgba(244,63,94,0.08)",
                        color: item.quantity === 1 ? "#f43f5e" : "#c8b89a",
                      }}
                    >
                      {item.quantity === 1 ? "×" : "−"}
                    </button>
                    <span
                      className="w-6 text-center text-xs font-bold"
                      style={{ color: "#f5e6d0", fontFamily: "'Courier New', monospace", background: "rgba(255,255,255,0.03)" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-7 h-7 flex items-center justify-center text-sm transition-colors"
                      style={{
                        background: "rgba(200,146,58,0.08)",
                        color: "#c8923a",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          <div
            className="px-5 pt-4 pb-5 space-y-4 border-t shrink-0"
            style={{
              borderColor: "rgba(255,255,255,0.06)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            {/* Member ID */}
            <div>
              <label
                className="text-[10px] tracking-widest uppercase block mb-1.5"
                style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}
              >
                ID Member (Opsional)
              </label>
              <input
                type="number"
                placeholder="Contoh: 1"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#f5e6d0",
                  fontFamily: "'Courier New', monospace",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(200,146,58,0.4)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                }}
              />
            </div>

            {/* Total */}
            <div
              className="flex items-center justify-between py-3 px-4 rounded-xl"
              style={{ background: "rgba(200,146,58,0.06)", border: "1px solid rgba(200,146,58,0.15)" }}
            >
              <span className="text-xs tracking-widest uppercase" style={{ color: "#8a7560", fontFamily: "'Courier New', monospace" }}>
                TOTAL BAYAR
              </span>
              <span className="text-xl font-bold" style={{ color: "#c8923a", fontFamily: "'Courier New', monospace" }}>
                Rp {grandTotal.toLocaleString("id-ID")}
              </span>
            </div>

            {/* Checkout Button */}
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0 || checkoutLoading}
              className="w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background:
                  cart.length === 0
                    ? "rgba(255,255,255,0.05)"
                    : "linear-gradient(135deg, #c8923a, #e8a84a)",
                color: cart.length === 0 ? "#8a7560" : "#0d0a08",
                fontFamily: "'Courier New', monospace",
                boxShadow:
                  cart.length > 0
                    ? "0 4px 24px rgba(200,146,58,0.35)"
                    : "none",
              }}
            >
              {checkoutLoading ? "⏳ MEMPROSES..." : "✓ BAYAR & CETAK STRUK"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}