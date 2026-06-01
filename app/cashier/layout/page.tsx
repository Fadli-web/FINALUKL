"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "📁 Kelola Kategori", path: "/manager/categories" },
    { name: "☕ Kelola Menu", path: "/manager/menus" },
    { name: "📊 Semua Transaksi", path: "/manager/orders" },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-50 text-zinc-800">
      {/* SIDEBAR MANAGER */}
      <aside className="w-64 bg-zinc-950 text-zinc-400 border-r border-zinc-800 flex flex-col fixed h-full z-50">
        {/* Logo Brand */}
        <div className="h-16 px-6 border-b border-zinc-800/60 flex items-center gap-2 bg-zinc-950">
          <span className="text-xl">☕</span>
          <span className="font-black text-white tracking-wider text-base font-mono">CAFE-POS</span>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 p-4 space-y-1.5 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition duration-200 ${
                  isActive
                    ? "bg-amber-600 text-white shadow-md shadow-amber-600/10"
                    : "hover:bg-zinc-900 hover:text-zinc-200"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-900 text-center text-[10px] text-zinc-600 font-mono">
          v1.0.0 • MANAGER ROLE
        </div>
      </aside>

      {/* KONTEN UTAMA */}
      <div className="flex-1 pl-64 flex flex-col">
        <Navbar allowedRole="MANAGER" />
        <main className="p-6 md:p-8 flex-1 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}