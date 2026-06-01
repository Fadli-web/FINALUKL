"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/utils/api";

interface Category {
  id: number;
  name: string;
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#141414] border border-white/10 rounded-3xl shadow-2xl p-8 animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-xl bg-white/[0.06] hover:bg-white/10 text-zinc-400 flex items-center justify-center transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h3 className="text-xl font-black text-white mb-6">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await apiRequest("/categories");
      setCategories(res.data || []);
    } catch {
      alert("Gagal memuat kategori");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const openAdd = () => { setEditingId(null); setName(""); setModalOpen(true); };
  const openEdit = (cat: Category) => { setEditingId(cat.id); setName(cat.name); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setName(""); setEditingId(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (editingId) {
        await apiRequest(`/categories/${editingId}`, { method: "PUT", body: JSON.stringify({ name }) });
      } else {
        await apiRequest("/categories", { method: "POST", body: JSON.stringify({ name }) });
      }
      closeModal();
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus kategori ini?")) return;
    setDeletingId(id);
    try {
      await apiRequest(`/categories/${id}`, { method: "DELETE" });
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const ICON_COLORS = [
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-blue-500 to-indigo-500",
    "from-purple-500 to-pink-500",
    "from-rose-500 to-red-500",
    "from-cyan-500 to-sky-500",
  ];

  return (
    <>
      <div className="space-y-6 p-1">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-amber-500 mb-2">Manajemen</p>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">Kategori Menu</h2>
            <p className="text-zinc-500 text-sm mt-1.5">Kelola pengelompokan sajian dan hidangan cafe.</p>
          </div>
          <button
            onClick={openAdd}
            className="inline-flex items-center gap-2.5 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm px-5 py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 hover:-translate-y-0.5 flex-shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Kategori Baru
          </button>
        </div>

        {/* Content */}
        {pageLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 rounded-2xl bg-white/[0.03] border border-white/[0.06] animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-2xl mb-4">
              📁
            </div>
            <p className="text-zinc-300 font-bold">Belum ada kategori</p>
            <p className="text-zinc-600 text-sm mt-1">Mulai dengan menambahkan kategori pertama.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((cat, idx) => (
              <div
                key={cat.id}
                className="group relative bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] hover:border-white/[0.16] rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${ICON_COLORS[idx % ICON_COLORS.length]} flex items-center justify-center text-white font-black text-lg flex-shrink-0`}>
                    {cat.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-white truncate">{cat.name}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">ID #{cat.id}</p>
                  </div>
                </div>

                {/* Actions — shown on hover */}
                <div className="absolute top-4 right-4 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => openEdit(cat)}
                    className="w-8 h-8 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-black flex items-center justify-center transition-all duration-200"
                    title="Edit"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(cat.id)}
                    disabled={deletingId === cat.id}
                    className="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white flex items-center justify-center transition-all duration-200 disabled:opacity-50"
                    title="Hapus"
                  >
                    {deletingId === cat.id ? (
                      <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Count badge */}
        {!pageLoading && categories.length > 0 && (
          <p className="text-center text-zinc-600 text-xs">
            {categories.length} kategori terdaftar
          </p>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={closeModal} title={editingId ? "Edit Kategori" : "Tambah Kategori Baru"}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">
              Nama Kategori
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="cth: Minuman Panas, Makanan Berat..."
              className="w-full bg-white/[0.06] border border-white/10 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/10 rounded-xl px-4 py-3 text-white placeholder-zinc-600 text-sm outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeModal}
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
              ) : editingId ? "Simpan Perubahan" : "Tambah Kategori"}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}