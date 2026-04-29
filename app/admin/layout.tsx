import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white flex">
      <aside className="w-64 border-r border-white/10 p-6 hidden md:flex flex-col justify-between">
        <div>
          <div className="text-xl font-bold mb-10">
            jokiin<span className="text-blue-500">.admin</span>
          </div>
          <nav className="space-y-4 text-sm text-gray-400">
            <Link href="/admin" className="block hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/admin/games" className="block hover:text-white transition">
              Kelola Game
            </Link>
            <Link href="/admin/services" className="block hover:text-white transition">
              Kelola Layanan
            </Link>
          </nav>
        </div>
        <Link href="/" className="text-sm text-gray-500 hover:text-yellow-400 transition">
          ← Kembali ke Web
        </Link>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">{children}</main>
    </div>
  );
}
