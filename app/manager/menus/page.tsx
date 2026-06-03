// "use client";

// import { useEffect, useState } from "react";
// import { apiRequest } from "@/utils/api";

// interface Menu {
//   id: number;
//   name: string;
//   price: number;
//   stock: number;
//   isAvailable: boolean;
//   categoryId: number;
// }

// interface Category {
//   id: number;
//   name: string;
// }

// const EMPTY_FORM = { name: "", price: "", stock: "", categoryId: "", isAvailable: true };

// function InputField({
//   label,
//   prefix,
//   ...props
// }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; prefix?: string }) {
//   return (
//     <div className="space-y-1.5">
//       <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">{label}</label>
//       <div className="relative">
//         {prefix && (
//           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-semibold pointer-events-none">
//             {prefix}
//           </span>
//         )}
//         <input
//           {...props}
//           className={`w-full bg-white/[0.06] border border-white/10 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-xl py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all ${
//             prefix ? "pl-11 pr-4" : "px-4"
//           }`}
//         />
//       </div>
//     </div>
//   );
// }

// export default function MenusPage() {
//   const [menus, setMenus] = useState<Menu[]>([]);
//   const [categories, setCategories] = useState<Category[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [editingId, setEditingId] = useState<number | null>(null);
//   const [formData, setFormData] = useState(EMPTY_FORM);
//   const [drawerOpen, setDrawerOpen] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [filterCat, setFilterCat] = useState<number | null>(null);

//   const fetchData = async () => {
//     try {
//       const [menuRes, catRes] = await Promise.all([apiRequest("/menus"), apiRequest("/categories")]);
//       setMenus(menuRes.data || []);
//       setCategories(catRes.data || []);
//     } catch {
//       alert("Gagal memuat data menu");
//     } finally {
//       setPageLoading(false);
//     }
//   };

//   useEffect(() => { fetchData(); }, []);

//   const openAdd = () => { setEditingId(null); setFormData(EMPTY_FORM); setDrawerOpen(true); };
//   const openEdit = (menu: Menu) => {
//     setEditingId(menu.id);
//     setFormData({
//       name: menu.name,
//       price: String(menu.price),
//       stock: String(menu.stock),
//       categoryId: String(menu.categoryId),
//       isAvailable: menu.isAvailable,
//     });
//     setDrawerOpen(true);
//   };
//   const closeDrawer = () => { setDrawerOpen(false); setEditingId(null); setFormData(EMPTY_FORM); };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     const payload = {
//       name: formData.name,
//       price: Number(formData.price),
//       stock: Number(formData.stock),
//       categoryId: Number(formData.categoryId),
//       isAvailable: formData.isAvailable,
//     };
//     try {
//       if (editingId) {
//         await apiRequest(`/menus/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
//       } else {
//         await apiRequest("/menus", { method: "POST", body: JSON.stringify(payload) });
//       }
//       closeDrawer();
//       fetchData();
//     } catch (err: any) {
//       alert(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     if (!confirm("Hapus menu ini?")) return;
//     try {
//       await apiRequest(`/menus/${id}`, { method: "DELETE" });
//       fetchData();
//     } catch (err: any) {
//       alert(err.message);
//     }
//   };

//   const set = (key: keyof typeof formData, value: string | boolean) =>
//     setFormData((prev) => ({ ...prev, [key]: value }));

//   const getCategoryName = (id: number) =>
//     categories.find((c) => c.id === id)?.name || `#${id}`;

//   const filtered = menus.filter((m) => {
//     const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
//     const matchCat = filterCat === null || m.categoryId === filterCat;
//     return matchSearch && matchCat;
//   });

//   return (
//     <>
//       <div className="space-y-6 p-1">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
//           <div>
//             <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-2">Manajemen</p>
//             <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Menu Cafe</h2>
//             <p className="text-zinc-500 text-sm mt-1.5">Kelola item, harga, dan stok sajian hidangan.</p>
//           </div>
//           <button
//             onClick={openAdd}
//             className="inline-flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-5 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 flex-shrink-0"
//           >
//             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//             </svg>
//             Menu Baru
//           </button>
//         </div>

//         {/* Filter & Search Bar */}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <div className="relative flex-1">
//             <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//             </svg>
//             <input
//               type="text"
//               placeholder="Cari menu..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-zinc-600 text-sm outline-none transition-all"
//             />
//           </div>
//           <div className="flex gap-2 flex-wrap">
//             <button
//               onClick={() => setFilterCat(null)}
//               className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
//                 filterCat === null
//                   ? "bg-amber-500 text-black"
//                   : "bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:border-white/20"
//               }`}
//             >
//               Semua
//             </button>
//             {categories.map((c) => (
//               <button
//                 key={c.id}
//                 onClick={() => setFilterCat(c.id)}
//                 className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
//                   filterCat === c.id
//                     ? "bg-amber-500 text-black"
//                     : "bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:border-white/20"
//                 }`}
//               >
//                 {c.name}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content */}
//         {pageLoading ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {[...Array(8)].map((_, i) => (
//               <div key={i} className="h-44 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
//             ))}
//           </div>
//         ) : filtered.length === 0 ? (
//           <div className="flex flex-col items-center justify-center py-24 text-center">
//             <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl mb-4">
//               ☕
//             </div>
//             <p className="text-zinc-300 font-bold">Belum ada menu</p>
//             <p className="text-zinc-600 text-sm mt-1">
//               {searchQuery ? "Tidak ada hasil pencarian." : "Tambahkan menu pertama Anda."}
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
//             {filtered.map((menu) => (
//               <div
//                 key={menu.id}
//                 className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-4"
//               >
//                 {/* Availability dot */}
//                 <div className="flex items-start justify-between gap-2">
//                   <div className="flex-1 min-w-0">
//                     <p className="font-bold text-white truncate text-base">{menu.name}</p>
//                     <p className="text-xs text-zinc-500 mt-0.5">{getCategoryName(menu.categoryId)}</p>
//                   </div>
//                   <span className={`flex-shrink-0 mt-1 w-2 h-2 rounded-full ${menu.isAvailable ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : "bg-zinc-600"}`} />
//                 </div>

//                 <div className="grid grid-cols-2 gap-2">
//                   <div className="bg-white/[0.04] rounded-xl px-3 py-2.5">
//                     <p className="text-xs text-zinc-500 mb-0.5">Harga</p>
//                     <p className="text-sm font-bold text-amber-400">
//                       {menu.price.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
//                     </p>
//                   </div>
//                   <div className="bg-white/[0.04] rounded-xl px-3 py-2.5">
//                     <p className="text-xs text-zinc-500 mb-0.5">Stok</p>
//                     <p className={`text-sm font-bold ${menu.stock <= 5 ? "text-red-400" : "text-zinc-200"}`}>
//                       {menu.stock} <span className="text-zinc-600 font-normal text-xs">pcs</span>
//                     </p>
//                   </div>
//                 </div>

//                 <div className="flex gap-2 mt-auto">
//                   <button
//                     onClick={() => openEdit(menu)}
//                     className="flex-1 text-xs font-bold py-2 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black transition-all duration-200"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDelete(menu.id)}
//                     className="flex-1 text-xs font-bold py-2 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-200"
//                   >
//                     Hapus
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {!pageLoading && filtered.length > 0 && (
//           <p className="text-center text-zinc-600 text-xs">{filtered.length} item ditampilkan</p>
//         )}
//       </div>

//       {/* Drawer */}
//       {drawerOpen && (
//         <div className="fixed inset-0 z-50 flex justify-end">
//           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDrawer} />
//           <div className="relative w-full max-w-md bg-[#141414] border-l border-white/10 h-full overflow-y-auto p-8 space-y-6 shadow-2xl">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
//                   {editingId ? "Edit" : "Tambah"}
//                 </p>
//                 <h3 className="text-2xl font-black text-white mt-1">
//                   {editingId ? "Edit Menu" : "Menu Baru"}
//                 </h3>
//               </div>
//               <button
//                 onClick={closeDrawer}
//                 className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-400 flex items-center justify-center transition"
//               >
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-5">
//               <InputField
//                 label="Nama Menu"
//                 type="text"
//                 required
//                 placeholder="cth: Kopi Susu, Es Teh..."
//                 value={formData.name}
//                 onChange={(e) => set("name", e.target.value)}
//               />
//               <InputField
//                 label="Harga"
//                 type="number"
//                 required
//                 prefix="Rp"
//                 placeholder="25000"
//                 min={0}
//                 value={formData.price}
//                 onChange={(e) => set("price", e.target.value)}
//               />
//               <InputField
//                 label="Jumlah Stok"
//                 type="number"
//                 required
//                 placeholder="50"
//                 min={0}
//                 value={formData.stock}
//                 onChange={(e) => set("stock", e.target.value)}
//               />

//               <div className="space-y-1.5">
//                 <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">Kategori</label>
//                 <select
//                   required
//                   className="w-full bg-white/[0.06] border border-white/10 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all appearance-none cursor-pointer"
//                   value={formData.categoryId}
//                   onChange={(e) => set("categoryId", e.target.value)}
//                 >
//                   <option value="" disabled className="bg-zinc-900">-- Pilih Kategori --</option>
//                   {categories.map((c) => (
//                     <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <label className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/30 rounded-xl px-4 py-3.5 cursor-pointer transition">
//                 <div className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${formData.isAvailable ? "bg-amber-500" : "bg-white/10"}`}>
//                   <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${formData.isAvailable ? "translate-x-5" : "translate-x-1"}`} />
//                   <input
//                     type="checkbox"
//                     className="sr-only"
//                     checked={formData.isAvailable}
//                     onChange={(e) => set("isAvailable", e.target.checked)}
//                   />
//                 </div>
//                 <div>
//                   <p className="text-sm font-bold text-white">Tersedia untuk Dijual</p>
//                   <p className="text-xs text-zinc-500 mt-0.5">Item akan muncul di menu pelanggan</p>
//                 </div>
//               </label>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={closeDrawer}
//                   className="flex-1 bg-white/[0.06] hover:bg-white/10 text-zinc-300 font-semibold py-3 rounded-xl text-sm transition"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
//                 >
//                   {loading ? (
//                     <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
//                   ) : editingId ? "Simpan" : "Tambah Menu"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }








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
  imageUrl?: string; // Menambahkan tipe imageUrl sesuai SS Postman
}

interface Category {
  id: number;
  name: string;
}

// Menambahkan imageUrl ke object form default
const EMPTY_FORM = { name: "", price: "", stock: "", categoryId: "", isAvailable: true, imageUrl: "" };

function InputField({
  label,
  prefix,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; prefix?: string }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">{label}</label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 text-sm font-semibold pointer-events-none">
            {prefix}
          </span>
        )}
        <input
          {...props}
          className={`w-full bg-white/[0.06] border border-white/10 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-xl py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all ${
            prefix ? "pl-11 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
}

export default function MenusPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCat, setFilterCat] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [menuRes, catRes] = await Promise.all([apiRequest("/menus"), apiRequest("/categories")]);
      setMenus(menuRes.data || []);
      setCategories(catRes.data || []);
    } catch {
      alert("Gagal memuat data menu");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const openAdd = () => { setEditingId(null); setFormData(EMPTY_FORM); setDrawerOpen(true); };
  const openEdit = (menu: Menu) => {
    setEditingId(menu.id);
    setFormData({
      name: menu.name,
      price: String(menu.price),
      stock: String(menu.stock),
      categoryId: String(menu.categoryId),
      isAvailable: menu.isAvailable,
      imageUrl: menu.imageUrl || "", // Mapping imageUrl saat mode edit
    });
    setDrawerOpen(true);
  };
  const closeDrawer = () => { setDrawerOpen(false); setEditingId(null); setFormData(EMPTY_FORM); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      name: formData.name,
      price: Number(formData.price),
      stock: Number(formData.stock),
      categoryId: Number(formData.categoryId),
      isAvailable: formData.isAvailable,
      imageUrl: formData.imageUrl, // Mengirimkan payload imageUrl ke API
    };
    try {
      if (editingId) {
        await apiRequest(`/menus/${editingId}`, { method: "PUT", body: JSON.stringify(payload) });
      } else {
        await apiRequest("/menus", { method: "POST", body: JSON.stringify(payload) });
      }
      closeDrawer();
      fetchData();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus menu ini?")) return;
    try {
      await apiRequest(`/menus/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const set = (key: keyof typeof formData, value: string | boolean) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const getCategoryName = (id: number) =>
    categories.find((c) => c.id === id)?.name || `#${id}`;

  const filtered = menus.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchCat = filterCat === null || m.categoryId === filterCat;
    return matchSearch && matchCat;
  });

  return (
    <>
      <div className="space-y-6 p-4 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-2">Manajemen</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Menu Cafe</h2>
            <p className="text-zinc-500 text-sm mt-1.5">Kelola item, harga, gambar, dan stok sajian hidangan.</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center justify-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-5 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 w-full sm:w-auto flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Menu Baru
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder-zinc-600 text-sm outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none snap-x">
            <button
              onClick={() => setFilterCat(null)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap snap-clamp ${
                filterCat === null
                  ? "bg-amber-500 text-black"
                  : "bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:border-white/20"
              }`}
            >
              Semua
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setFilterCat(c.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap snap-clamp ${
                  filterCat === c.id
                    ? "bg-amber-500 text-black"
                    : "bg-white/[0.04] border border-white/[0.08] text-zinc-400 hover:border-white/20"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        {pageLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-64 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl mb-4">
              ☕
            </div>
            <p className="text-zinc-300 font-bold">Belum ada menu</p>
            <p className="text-zinc-600 text-sm mt-1">
              {searchQuery ? "Tidak ada hasil pencarian." : "Tambahkan menu pertama Anda."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((menu) => (
              <div
                key={menu.id}
                className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-4 transition-all duration-300 hover:-translate-y-0.5 flex flex-col gap-3"
              >
                {/* Menu Image Area */}
                <div className="relative w-full h-40 bg-white/[0.02] rounded-xl overflow-hidden border border-white/5 flex items-center justify-center">
                  {menu.imageUrl ? (
                    <img
                      src={menu.imageUrl}
                      alt={menu.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback jika link gambar rusak
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x300/141414/white?text=No+Image";
                      }}
                    />
                  ) : (
                    <span className="text-3xl opacity-40">☕</span>
                  )}
                  {/* Availability dot di atas gambar */}
                  <span className={`absolute top-3 right-3 w-2.5 h-2.5 rounded-full z-10 ${menu.isAvailable ? "bg-emerald-400 shadow-sm shadow-emerald-400/50" : "bg-zinc-600"}`} />
                </div>

                {/* Content Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-white truncate text-base">{menu.name}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{getCategoryName(menu.categoryId)}</p>
                </div>

                {/* Details Price & Stock */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/[0.04] rounded-xl px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Harga</p>
                    <p className="text-xs sm:text-sm font-bold text-amber-400 truncate">
                      {menu.price.toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 })}
                    </p>
                  </div>
                  <div className="bg-white/[0.04] rounded-xl px-3 py-2">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-0.5">Stok</p>
                    <p className={`text-xs sm:text-sm font-bold ${menu.stock <= 5 ? "text-red-400" : "text-zinc-200"}`}>
                      {menu.stock} <span className="text-zinc-600 font-normal text-[10px]">pcs</span>
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => openEdit(menu)}
                    className="flex-1 text-xs font-bold py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black transition-all duration-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(menu.id)}
                    className="flex-1 text-xs font-bold py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white transition-all duration-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!pageLoading && filtered.length > 0 && (
          <p className="text-center text-zinc-600 text-xs pt-2">{filtered.length} item ditampilkan</p>
        )}
      </div>

      {/* Drawer Form */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeDrawer} />
          <div className="relative w-full max-w-md bg-[#141414] border-l border-white/10 h-full overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-500">
                  {editingId ? "Edit" : "Tambah"}
                </p>
                <h3 className="text-2xl font-black text-white mt-1">
                  {editingId ? "Edit Menu" : "Menu Baru"}
                </h3>
              </div>
              <button
                onClick={closeDrawer}
                className="w-10 h-10 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-400 flex items-center justify-center transition"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col justify-between">
              <div className="space-y-5">
                <InputField
                  label="Nama Menu"
                  type="text"
                  required
                  placeholder="cth: Kopi Susu, Es Teh..."
                  value={formData.name}
                  onChange={(e) => set("name", e.target.value)}
                />

                {/* Field Baru: Link Image Address */}
                <InputField
                  label="Link Alamat Gambar (URL)"
                  type="url"
                  placeholder="https://example.com/gambar-menu.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => set("imageUrl", e.target.value)}
                />

                {/* Preview Image mini di dalam drawer jika URL valid */}
                {formData.imageUrl && (
                  <div className="mt-1 w-full h-24 bg-white/[0.02] border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
                    <img 
                      src={formData.imageUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Harga"
                    type="number"
                    required
                    prefix="Rp"
                    placeholder="25000"
                    min={0}
                    value={formData.price}
                    onChange={(e) => set("price", e.target.value)}
                  />
                  <InputField
                    label="Jumlah Stok"
                    type="number"
                    required
                    placeholder="50"
                    min={0}
                    value={formData.stock}
                    onChange={(e) => set("stock", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">Kategori</label>
                  <select
                    required
                    className="w-full bg-white/[0.06] border border-white/10 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-xl px-4 py-3 text-white text-sm outline-none transition-all appearance-none cursor-pointer"
                    value={formData.categoryId}
                    onChange={(e) => set("categoryId", e.target.value)}
                  >
                    <option value="" disabled className="bg-zinc-900">-- Pilih Kategori --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id} className="bg-zinc-900">{c.name}</option>
                    ))}
                  </select>
                </div>

                <label className="flex items-center gap-3 bg-white/[0.04] border border-white/[0.08] hover:border-amber-500/30 rounded-xl px-4 py-3.5 cursor-pointer transition">
                  <div className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${formData.isAvailable ? "bg-amber-500" : "bg-white/10"}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${formData.isAvailable ? "translate-x-5" : "translate-x-1"}`} />
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={formData.isAvailable}
                      onChange={(e) => set("isAvailable", e.target.checked)}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Tersedia untuk Dijual</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Item akan muncul di menu pelanggan</p>
                  </div>
                </label>
              </div>

              <div className="flex gap-3 pt-6 mt-auto">
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="flex-1 bg-white/[0.06] hover:bg-white/10 text-zinc-300 font-semibold py-3 rounded-xl text-sm transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-60 text-black font-bold py-3 rounded-xl text-sm transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  ) : editingId ? "Simpan" : "Tambah Menu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}