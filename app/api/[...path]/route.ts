// // app/api/[...path]/route.ts
// import { NextResponse } from "next/server";

// // 1. PAKSA Next.js agar menganggap rute ini selalu dinamis (tidak di-cache secara statis)
// export const dynamic = "force-dynamic";

// export async function handleUniversalProxy(request: Request) {
//   try {
//     const { pathname, search } = new URL(request.url);
//     const targetPath = pathname.replace(/^\/api/, "");
//     const backendUrl = "https://cafe-pos-backend-production.up.railway.app";
//     const finalUrl = `${backendUrl}${targetPath}${search}`;

//     const method = request.method;
//     const requestHeaders = new Headers(request.headers);
//     requestHeaders.delete("host");

//     let body: any = null;
//     if (method !== "GET" && method !== "HEAD") {
//       body = await request.text();
//     }

//     // 2. TAMBAHKAN cache: "no-store" agar data fetch antar-user tidak saling tertukar di server
//     const res = await fetch(finalUrl, {
//       method,
//       headers: requestHeaders,
//       body,
//       cache: "no-store", // ⬅️ Ini kuncinya! Mematikan Next.js Data Cache
//     });

//     const data = await res.json().catch(() => null);
//     return NextResponse.json(data, { status: res.status });
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: "Terjadi kesalahan pada Universal Proxy", error: error.message },
//       { status: 500 }
//     );
//   }
// }

// export { handleUniversalProxy as GET, handleUniversalProxy as POST, handleUniversalProxy as PUT, handleUniversalProxy as DELETE };