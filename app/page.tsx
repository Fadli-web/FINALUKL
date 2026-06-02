"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function PremiumLandingPage() {
  // State untuk melacak Role mana yang sedang aktif di simulator
  const [activeRole, setActiveRole] = useState<'manager' | 'cashier' | 'customer'>('manager');

  // Data dinamis yang disesuaikan dengan Postman JSON API kamu
  const roleShowcases = {
    manager: {
      title: "Core Business Command Center",
      badge: "Full Privilege Access",
      description: "Akses penuh enkripsi untuk mengontrol ekosistem bisnis cafe. Mengelola menu terintegrasi dengan kategori, memantau ketersediaan stok secara real-time, dan manajemen hak akses multi-user.",
      endpoints: ["POST /categories", "PUT /menus/:id", "DELETE /categories/:id"],
      mockUI: (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-amber-500/10 pb-2">
            <span className="text-gray-400">📊 Total Pendapatan</span>
            <span className="text-emerald-400 font-bold">Rp 4.250.000</span>
          </div>
          <div className="p-2.5 rounded bg-[#0d0a08] border border-amber-500/10">
            <div className="text-[#8a7560] mb-1">// Quick Action: Tambah Menu</div>
            <div className="text-gray-500">{"{"} name: <span className="text-amber-400">"Kopi Espresso"</span>, price: <span className="text-emerald-400">25000</span>, stock: <span className="text-emerald-400">50</span>, categoryId: <span className="text-amber-400">1</span> {"}"}</div>
          </div>
          <div className="flex gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-[10px] border border-amber-500/20">Category: Minuman Panas</span>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20">Stok: 50 Tersedia</span>
          </div>
        </div>
      )
    },
    cashier: {
      title: "High-Velocity Transaction POS",
      badge: "Operational Staff Only",
      description: "Dioptimalkan untuk kecepatan entri transaksi langsung di meja kasir. Terintegrasi dengan perubahan state order yang instan guna memangkas antrean pelanggan pada jam sibuk.",
      endpoints: ["POST /orders (For Customer)", "PUT /orders/:id/status"],
      mockUI: (
        <div className="space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between bg-amber-500/5 p-2 rounded border border-amber-500/15 animate-pulse">
            <span className="text-amber-400 font-bold">⚠️ NEW ORDER #104</span>
            <span className="px-2 py-0.5 text-[10px] bg-amber-500 text-black font-bold rounded">PENDING</span>
          </div>
          <div className="space-y-1.5 pl-1 text-gray-400">
            <div>• 3x Kopi Espresso (Meja 05)</div>
            <div>• 1x Croissant Cokelat</div>
          </div>
          <button className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded text-center transition-all shadow-md shadow-emerald-900/30">
            ✓ APPROVE & MARK COMPLETED
          </button>
        </div>
      )
    },
    customer: {
      title: "Seamless Self-Service App",
      badge: "Public Access Gate",
      description: "Memberikan pengalaman berbelanja mandiri yang modern bagi pelanggan langsung dari gadget mereka. Jelajahi menu digital terbaru, kelola keranjang belanja, dan pantau histori pesanan secara live.",
      endpoints: ["POST /orders", "GET /orders (Self-Only)"],
      mockUI: (
        <div className="space-y-3 font-mono text-xs">
          <div className="text-gray-400 mb-1">🛒 Keranjang Belanja Anda:</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center bg-[#0d0a08] p-2 rounded border border-amber-500/5">
              <span>☕ Kopi Latte x2</span>
              <span className="text-amber-400">Rp 60.000</span>
            </div>
          </div>
          <div className="border-t border-amber-500/10 pt-2 flex justify-between font-bold text-white text-sm">
            <span>Total Bayar:</span>
            <span className="text-emerald-400">Rp 60.000</span>
          </div>
          <div className="text-center text-[11px] text-gray-500 bg-amber-500/5 py-1.5 rounded border border-amber-500/10">
            🔒 Token JWT Disimpan Otomatis
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0a08] text-gray-300 font-sans selection:bg-[#8a7560]/40 selection:text-white overflow-x-hidden relative">
      
      {/* BACKGROUND DECORATION (Cyberpunk Line & Glow) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#14100c_1px,transparent_1px),linear-gradient(to_bottom,#14100c_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[350px] bg-gradient-to-b from-[#8a7560]/10 to-transparent blur-[120px] pointer-events-none" />

      {/* NAVBAR */}
      <motion.nav 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="border-b border-amber-500/10 bg-[#0d0a08]/80 backdrop-blur-xl sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#8a7560]/20 border border-[#8a7560]/40 flex items-center justify-center text-amber-500 font-mono font-bold text-sm">C</div>
            <span className="text-lg font-bold tracking-widest text-[#8a7560] font-mono">
              CAFE<span className="text-amber-500">.POS</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="px-4 py-2 text-sm font-mono text-gray-400 hover:text-white transition-colors">
              [ Login ]
            </Link>
            <Link href="/auth/register" className="px-4 py-2 text-sm font-mono bg-[#8a7560] hover:bg-[#8a7560]/80 text-white rounded shadow-lg shadow-[#8a7560]/10 transition-all border border-[#8a7560]/40">
              Register
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* HERO SECTION */}
      <header className="relative pt-24 pb-16 lg:pt-32 lg:pb-24 px-4 max-w-7xl mx-auto text-center z-10">
        {/* Real-time Status API Badge */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 font-mono mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          BACKEND LIVE CONNECTED : RAILWAY.APP
        </motion.div>

        {/* Headline Premium */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 leading-tight max-w-5xl mx-auto"
        >
          Arsitektur Kasir Modern <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8a7560] via-amber-400 to-[#caa98a]">
            Berbasis Multi-Role Access
          </span>
        </motion.h1>

        {/* Deskripsi Menjelaskan Keunggulan Sistem */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed font-light"
        >
          Proyek Point of Sales terintegrasi penuh untuk tugas UKL Semester Genap SMK Telkom Malang. Dirancang presisi menggunakan Next.js App Router untuk kendali berlapis operasional cafe masa kini.
        </motion.p>

        {/* Main CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 max-w-md mx-auto mb-20"
        >
          <Link href="/auth" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#8a7560] to-[#bda48a] text-black font-bold rounded shadow-2xl shadow-[#8a7560]/20 hover:opacity-95 transition-all text-center">
            Buka Dashboard Aplikasi
          </Link>
          <a href="#sandbox" className="w-full sm:w-auto px-8 py-4 border border-amber-500/20 bg-amber-500/5 text-amber-400 font-mono text-sm font-medium rounded hover:bg-amber-500/10 transition-all text-center">
            &lt; Explore API Sandbox /&gt;
          </a>
        </motion.div>

        {/* RESPONSIVE FLOATING IMAGE HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative w-full max-w-5xl mx-auto"
        >
          {/* Animasi Floating Terus Menerus */}
          <motion.div
            animate={{ y: [-15, 15, -15] }}
            transition={{ 
              repeat: Infinity, 
              duration: 5, 
              ease: "easeInOut" 
            }}
            className="relative aspect-[16/9] w-full rounded-2xl border border-amber-500/20 shadow-[0_0_80px_-20px_rgba(202,169,138,0.25)] overflow-hidden bg-[#110d0a]/50 backdrop-blur-sm flex items-center justify-center"
          >
            {/* Ganti '/hero-mockup.png' dengan nama file gambarmu di folder public */}
            <Image 
              src="/coffe2.jpg" 
              alt="Dashboard App Preview"
              fill
              className="object-cover sm:object-contain p-2 sm:p-4 opacity-90 hover:opacity-100 transition-opacity duration-500 rounded rounded-2xl"
              priority
            />
            
            {/* Fallback Text (Akan tertutup jika gambar berhasil di-load) */}
            <div className="absolute inset-0 flex items-center justify-center text-amber-500/30 font-mono text-sm -z-10">
              [ Masukkan gambar 'hero-mockup.png' ke folder /public ]
            </div>
          </motion.div>
          
          {/* Decorative Glow di Bawah Gambar */}
          <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-[80%] h-[30px] bg-amber-500/20 blur-[50px] rounded-full pointer-events-none" />
        </motion.div>
      </header>

      {/* UNIQUE VALUE MOCKUP SECTION (INTERACTIVE SHOWCASE) */}
      <section id="sandbox" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10">
        <div className="text-center sm:text-left mb-10 flex flex-col sm:flex-row justify-between items-end gap-4 border-b border-amber-500/10 pb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white mb-2">Interactive Ecosystem</h2>
            <p className="text-sm text-gray-500">Klik tab di bawah untuk melihat simulasi pertukaran data API di setiap role.</p>
          </div>
          {/* Tabs Selector */}
          <div className="flex bg-[#120e0a] p-1 rounded border border-amber-500/10 w-full sm:w-auto">
            {(['manager', 'cashier', 'customer'] as const).map((role) => (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-mono font-bold uppercase rounded tracking-wider transition-all ${
                  activeRole === role 
                    ? 'bg-[#8a7560] text-white shadow-md' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Sisi Kiri: Deskripsi & Route API */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeRole}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div className="inline-block px-2.5 py-1 text-[10px] uppercase tracking-widest font-mono font-bold bg-[#8a7560]/10 text-[#caa98a] border border-[#8a7560]/20 rounded">
                  {roleShowcases[activeRole].badge}
                </div>
                <h3 className="text-2xl font-bold text-white">{roleShowcases[activeRole].title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{roleShowcases[activeRole].description}</p>
                
                {/* Router Endpoint Lists */}
                <div className="pt-4 space-y-2">
                  <div className="text-xs font-mono text-gray-500">// Terhubung ke Endpoint Backend:</div>
                  <div className="flex flex-wrap gap-2">
                    {roleShowcases[activeRole].endpoints.map((ep) => (
                      <span key={ep} className="px-2.5 py-1 bg-[#14100c] border border-amber-500/10 rounded font-mono text-[11px] text-amber-400">
                        {ep}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sisi Kanan: Mock Interface / Code Preview */}
          <div className="lg:col-span-7 bg-[#110d0a] border border-amber-500/10 rounded-xl overflow-hidden shadow-2xl relative flex flex-col">
            {/* Window Header Decorator */}
            <div className="bg-[#18130e] border-b border-amber-500/10 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/40 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/40 inline-block" />
              </div>
              <span className="text-[11px] font-mono text-gray-500">cafe-pos-simulation.json</span>
              <span className="w-4" />
            </div>
            {/* Window Content */}
            <div className="p-6 flex-1 bg-gradient-to-b from-[#110d0a] to-[#0d0a08] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeRole}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-[#16110d] border border-amber-500/5 p-5 rounded-lg shadow-inner"
                >
                  {roleShowcases[activeRole].mockUI}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPER SANDBOX / EXAMINER CARD (VALUABLE VALUE) */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 rounded-xl bg-gradient-to-br from-[#120e0a] to-[#0d0a08] border border-amber-500/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[80px] pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7 space-y-3">
              <div className="text-xs font-mono text-[#8a7560] tracking-wider uppercase">// Quick Testing Node</div>
              <h3 className="text-xl font-bold text-white font-mono">Pemeriksaan & Pengujian Cepat</h3>
              <p className="text-xs text-gray-400 leading-relaxed max-w-xl">
                Gunakan kredensial pengujian yang sudah tertanam di sistem database untuk memeriksa validasi token JWT serta alur hak akses dari masing-masing level user tanpa registrasi ulang.
              </p>
            </div>
            
            {/* Interactive Copy-paste box for testing credentials */}
            <div className="md:col-span-5 bg-[#0d0a08] p-4 rounded border border-amber-500/10 font-mono text-[11px] space-y-2">
              <div className="text-gray-500 border-b border-amber-500/5 pb-1 flex justify-between">
                <span>🔐 ACCOUNT SYSTEM GATE</span>
                <span className="text-amber-500/60">UKL Final</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Manager:</span>
                <span className="text-amber-400">admin5 / 123456</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Cashier:</span>
                <span className="text-emerald-400">petugas2 / 123456</span>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-amber-500/10 py-8 bg-[#0d0a08] text-center font-mono text-[10px] text-gray-600 relative z-10">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>© 2026 SMK TELKOM MALANG - UKL PROJECT GENAP. ALL RIGHTS RESERVED.</p>
          <p className="text-[#8a7560]/60">BUILD WITH NEXT.JS APP ROUTER & TAILWIND & FRAMER MOTION</p>
        </div>
      </footer>

    </div>
  );
}