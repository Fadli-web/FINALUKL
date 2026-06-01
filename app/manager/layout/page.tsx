"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* HEADER UTAMA CUSTOMER */}
      <Navbar allowedRole="CUSTOMER" />

      {/* SUB-NAVBAR MENU CUSTOMER */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-6 py-2 sticky top-16 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto flex gap-4 text-xs font-bold uppercase tracking-wider">
          <Link 
            href="/customer/dashboard" 
            className={`px-3 py-2 rounded-lg transition ${
              pathname === "/customer/dashboard" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            ☕ Pesan Kopi & Snack
          </Link>
          <Link 
            href="/customer/history" 
            className={`px-3 py-2 rounded-lg transition ${
              pathname === "/customer/history" ? "bg-emerald-600 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            📄 Riwayat Struk Belanja
          </Link>
        </div>
      </div>

      {/* VIEWPORT AREA */}
      <main className="flex-1 p-4 md:p-8 max-w-4xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}