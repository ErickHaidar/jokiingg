"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 p-6 flex flex-col justify-between shrink-0">
        <div>
          <div className="text-xl font-bold mb-6 md:mb-10">
            jokiin<span className="text-blue-500">.admin</span>
          </div>
          <nav className="flex md:flex-col gap-4 md:space-y-4 text-sm text-gray-400 overflow-x-auto pb-2 md:pb-0">
            <Link href="/admin" className="hover:text-white transition whitespace-nowrap">
              Dashboard
            </Link>
            <Link href="/admin/games" className="hover:text-white transition whitespace-nowrap">
              Kelola Game
            </Link>
            <Link href="/admin/services" className="hover:text-white transition whitespace-nowrap">
              Kelola Layanan
            </Link>
          </nav>
        </div>
        <div className="mt-6 md:mt-0 pt-4 md:pt-0 border-t border-white/5 md:border-0 flex md:flex-col gap-4 justify-between items-center md:items-start">
          <Link href="/" className="text-sm text-gray-500 hover:text-yellow-400 transition">
            ← Ke Web
          </Link>
          <button 
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
