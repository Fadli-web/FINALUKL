"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, hasRole } from "@/lib/auth"; // ⬅️ Sesuaikan path ke auth.ts kamu
import Navbar from "./navbar"; // ⬅️ Panggil Navbar yang sudah kita buat sebelumnya

export default function LayoutWrapper({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Jalankan verifikasi keaslian session token
    if (!isAuthenticated() || !hasRole(allowedRoles)) {
      router.replace("/auth/login");
    } else {
      setIsVerified(true); // Izinkan masuk jika lolos verifikasi
    }
  }, [router, allowedRoles]);

  // Jika belum terverifikasi, kunci layar agar tidak nge-flash/berkedip loop
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white">
        <p className="text-orange-500 font-semibold text-lg animate-pulse">☕ CAFEG-POS</p>
        <p className="text-xs text-zinc-500 mt-1">Memverifikasi sesi Anda...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Navbar & Sidebar otomatis dipanggil di sini SATU KALI saja */}
      <Navbar />
      
      <main className="flex-1 p-4 md:p-6 w-full">
        {children}
      </main>
    </div>
  );
}