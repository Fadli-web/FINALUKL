// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { apiRequest } from "@/utils/api";
// import Link from "next/link";

// export default function LoginPage() {
//   const router = useRouter();
//   const [formData, setFormData] = useState({ username: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");
//     setLoading(true);

//     try {
//       const response = await apiRequest("/auth/login", {
//         method: "POST",
//         body: JSON.stringify(formData),
//       });

//       // Ambil data token & role dari response backend kamu
//       const { accessToken, role, id } = response.data;

//       // Simpan credentials ke LocalStorage (bisa diganti ke Cookies nanti untuk middleware)
//       localStorage.setItem("token", accessToken);
//       localStorage.setItem("user_role", role);
//       localStorage.setItem("user_id", id);

//       // Redirect otomatis sesuai dengan Role masing-masing
//       if (role === "MANAGER") {
//         router.push("/manager/dashboard");
//       } else if (role === "CASHIER") {
//         router.push("/cashier/pos");
//       } else {
//         router.push("/customer/dashboard");
//       }
//     } catch (err: any) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
//       <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
//         <div className="text-center">
//           <h2 className="text-3xl font-bold text-gray-800">Selamat Datang</h2>
//           <p className="text-sm text-gray-500 mt-1">Silakan masuk ke akun Cafe POS Anda</p>
//         </div>

//         {error && (
//           <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
//             {error}
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700">Username</label>
//             <input
//               type="text"
//               required
//               className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-brown-500 focus:ring-brown-500"
//               placeholder="Masukkan username"
//               value={formData.username}
//               onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700">Password</label>
//             <input
//               type="password"
//               required
//               className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-brown-500 focus:ring-brown-500"
//               placeholder="••••••••"
//               value={formData.password}
//               onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-lg bg-amber-700 p-3 font-semibold text-white hover:bg-amber-800 transition disabled:bg-gray-400"
//           >
//             {loading ? "Memverifikasi..." : "Masuk"}
//           </button>
//         </form>

//         <p className="text-center text-sm text-gray-600">
//           Belum punya akun?{" "}
//           <Link href="/auth/register" className="font-medium text-amber-700 hover:underline">
//             Daftar di sini
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/utils/api";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      // Ambil data token & role dari response backend kamu
      const { accessToken, role, id, username } = response.data;

      // SOLUSI 1: Simpan dengan key "role" agar dibaca seragam oleh Sidebar/Navbar
      localStorage.setItem("token", accessToken);
      localStorage.setItem("role", role); 
      localStorage.setItem("user_id", id);
      localStorage.setItem("username", username || formData.username);

      // SOLUSI 2: Redirect langsung ke halaman yang foldernya sudah ada agar tidak 404
      if (role === "MANAGER") {
        // Karena folder /manager/dashboard/page.tsx kamu belum ada, langsung lempar ke categories
        // Gunakan window.location.href agar halaman melakukan full reload & membaca localStorage baru
        window.location.href = "/manager/categories";
      } else if (role === "CASHIER") {
        window.location.href = "/cashier/pos";
      } else {
        window.location.href = "/customer/dashboard";
      }
    } catch (err: any) {
      setError(err.message || "Username atau password salah");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Selamat Datang</h2>
          <p className="text-sm text-gray-500 mt-1">Silakan masuk ke akun Cafe POS Anda</p>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-amber-500 focus:ring-amber-500"
              placeholder="Masukkan username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-gray-900 focus:border-amber-500 focus:ring-amber-500"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-amber-700 p-3 font-semibold text-white hover:bg-amber-800 transition disabled:bg-gray-400"
          >
            {loading ? "Memverifikasi..." : "Masuk"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="font-medium text-amber-700 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}