"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getUser, logout } from "@/lib/auth"; // 👑 Ambil dari pusat data auth kamu

type Role = "CUSTOMER" | "MANAGER" | "CASHIER";

export default function Navbar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false); // State untuk Sidebar HP
    const [role, setRole] = useState<Role | null>(null);
    const [username, setUsername] = useState("");

    // Ambil data user aktif saat komponen dipasang di browser
    useEffect(() => {
        const user = getUser();
        if (user) {
            setRole(user.role);
            setUsername(user.username || "User");
        }
    }, []);

    // 📋 PEMETAAN FITUR SEPERTI YANG KAMU MINTA:
    const menuItems = {
        CUSTOMER: [
            { name: "☕ Pesan Menu", href: "/customer/dashboard" },
            { name: "📜 Riwayat Struk", href: "/customer/history" },
        ],
        MANAGER: [
               { name: "🪨Dashboard ", href: "/manager/dashboard" },
            { name: "📂 Kategori", href: "/manager/categories" },
            { name: "🍔 Menu Makanan", href: "/manager/menus" },
            { name: "📊 Transaksi Kafe", href: "/manager/orders" },
        ],
        CASHIER: [
             { name: "🪨Dashboard ", href: "/cashier/dashboard" },
            { name: "🖥️ Kasir POS", href: "/cashier/pos" },
            { name: "📥 Orderan", href: "/cashier/orders" },
        ],
    };

    if (!role) return null;

    const currentMenu = menuItems[role] || [];

    return (
        <>
            {/* ======================================================================== */}
            {/* 1. TAMPILAN DESKTOP (Navbar Atas)                                       */}
            {/* ======================================================================== */}
            <nav className="hidden md:flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800 text-white sticky top-0 z-40 w-full">
                {/* Kiri: Brand & Menu Links */}
                <div className="flex items-center gap-8">
                    <div className="font-bold text-xl text-orange-500 tracking-wider">
                        ☕ CAFE
                    </div>

                    {/* Render Fitur Otomatis Sesuai Role */}
                    <div className="flex items-center gap-2">
                        {currentMenu.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
                                            ? "bg-orange-600 text-white shadow-md font-semibold"
                                            : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Kanan: Nama User, Badge Role, & Logout */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm font-medium text-zinc-200">{username}</p>
                        <p className="text-[10px] text-orange-400 font-bold tracking-widest uppercase">{role}</p>
                    </div>
                    <button
                        onClick={() => logout()}
                        className="bg-red-600/90 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all active:scale-95"
                    >
                        Keluar
                    </button>
                </div>
            </nav>

            {/* ======================================================================== */}
            {/* 2. TAMPILAN MOBILE (Header Topbar)                                      */}
            {/* ======================================================================== */}
            <div className="flex md:hidden items-center justify-between px-4 py-3.5 bg-zinc-900 border-b border-zinc-800 text-white sticky top-0 z-40 w-full">
                <div className="font-bold text-lg text-orange-500">☕ CAFEG-POS</div>

                {/* Tombol Hamburger Menu */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
            </div>

            {/* ======================================================================== */}
            {/* 3. TAMPILAN MOBILE SIDEBAR (Drawer Menu Slide-in)                       */}
            {/* ======================================================================== */}
            <div className={`fixed inset-0 z-50 md:hidden ${isOpen ? "visible" : "invisible"}`}>
                {/* Backdrop Belakang */}
                <div
                    onClick={() => setIsOpen(false)}
                    className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
                />

                {/* Konten Utama Sidebar */}
                <div className={`absolute top-0 left-0 bottom-0 w-72 bg-zinc-950 p-5 flex flex-col justify-between border-r border-zinc-800 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
                    <div>
                        {/* Bagian Atas Sidebar */}
                        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                            <div>
                                <span className="font-bold text-base text-orange-500">CAFEG-POS</span>
                                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-0.5">Sistem Manajemen</p>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Profile Singkat User */}
                        <div className="my-4 p-3 bg-zinc-900 rounded-lg border border-zinc-800">
                            <p className="text-xs font-semibold text-zinc-200">👋 {username}</p>
                            <span className="inline-block mt-1 bg-zinc-800 text-orange-400 border border-zinc-700 text-[9px] font-bold px-2 py-0.5 rounded tracking-wider uppercase">
                                {role}
                            </span>
                        </div>

                        {/* Link Fitur Dinamis Mobile */}
                        <div className="flex flex-col gap-1 mt-2">
                            {currentMenu.map((item) => {
                                const isActive = pathname === item.href;
                                return (
                                    <Link
                                        key={item.href}
                                        onClick={() => setIsOpen(false)}
                                        href={item.href}
                                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${isActive
                                                ? "bg-zinc-900 text-orange-500 border-l-4 border-orange-500 font-semibold pl-3"
                                                : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                                            }`}
                                    >
                                        <span>{item.name}</span>
                                        {isActive && <span className="w-1.5 h-1.5 bg-orange-500 rounded-full" />}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Tombol Keluar Aplikasi */}
                    <div className="pt-4 border-t border-zinc-800">
                        <button
                            onClick={() => logout()}
                            className="w-full bg-red-600 hover:bg-red-700 text-white text-sm font-medium py-2.5 rounded-lg transition-all flex items-center justify-center gap-2"
                        >
                            Keluar Aplikasi
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
