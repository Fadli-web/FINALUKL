"use client";

import { useEffect, useState } from "react";

interface NavbarProps {
  allowedRole: "MANAGER" | "CASHIER" | "CUSTOMER";
}

export default function Navbar({ allowedRole }: NavbarProps) {
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Ambil data user yang login dari localStorage
    const storedRole = localStorage.getItem("role");
    const storedUser = localStorage.getItem("username") || "User";
    setUsername(storedUser);

    // Proteksi Lapis Pertama (Frontend Router Guard):
    // Jika role di storage tidak sesuai dengan halaman yang diakses, tendang ke login
    if (storedRole !== allowedRole) {
      localStorage.clear();
      window.location.href = "/auth/login";
    }
  }, [allowedRole]);

  const handleLogout = () => {
    if (confirm("Apakah Anda ingin keluar dari sistem POS?")) {
      localStorage.clear();
      window.location.href = "/auth/login";
    }
  };

  // Tentukan warna badge berdasarkan role
  const badgeColor = 
    allowedRole === "MANAGER" ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
    allowedRole === "CASHIER" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" :
    "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";

  return (
    <nav className="h-16 border-b border-zinc-100 bg-white px-6 flex items-center justify-between sticky top-0 z-40 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-zinc-400 font-mono">WORKSPACE //</span>
        <span className={`text-xs font-black tracking-wider px-2.5 py-1 rounded-md border uppercase ${badgeColor}`}>
          {allowedRole} PANEL
        </span>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-zinc-800">{username}</p>
          <p className="text-xs font-medium text-zinc-400 capitalize">Sesi Aktif</p>
        </div>
        <div className="h-8 w-px bg-zinc-200"></div>
        <button
          onClick={handleLogout}
          className="bg-zinc-50 hover:bg-rose-50 hover:text-rose-600 text-zinc-600 px-3 py-2 rounded-xl text-xs font-bold transition duration-200 border border-zinc-200/60"
        >
          🚪 Keluar
        </button>
      </div>
    </nav>
  );
}