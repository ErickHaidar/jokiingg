import Link from "next/link";
import GameTabs from "@/components/GameTabs";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white overflow-hidden">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center border-b border-white/10 relative z-20">
        <div className="text-2xl font-bold tracking-wider">
          jokiin<span className="text-blue-500">.gg</span>
        </div>
        <div className="hidden md:flex gap-6 text-sm text-gray-300">
          <Link href="#katalog" className="hover:text-blue-500 transition">Marketplace</Link>
          <Link href="#howto" className="hover:text-blue-500 transition">How to Order</Link>
        </div>
      </nav>

      <section className="container mx-auto px-6 py-20 text-center relative z-10">
        <span className="bg-yellow-400/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest border border-yellow-400/30">
          Elite Gaming Services
        </span>
        <h1 className="text-5xl md:text-7xl font-bold mt-6 mb-4 leading-tight">
          Joki Manual Tanpa Cheat <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-cyan-400">
            Aman & Terpercaya
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto mb-10">
          Professional, secure, and fast progression for your favorite gacha and competitive games. 100% manual grinding by elite players.
        </p>
        <Link href="#katalog" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-md font-medium transition shadow-[0_0_15px_rgba(59,130,246,0.5)]">
          Lihat Katalog
        </Link>
      </section>

      <section id="katalog" className="container mx-auto px-6 py-10 relative z-40">
        <GameTabs />
      </section>

      <section id="howto" className="container mx-auto px-6 py-20 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">How to Order</h2>
          <p className="text-gray-400">A streamlined process for elite service. Your account safety is our primary directive.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { step: '01', title: 'Select Service', desc: 'Browse our catalog and identify the progression package that fits your needs.' },
            { step: '02', title: 'Contact Admin', desc: "Hit 'Pesan via DM' to connect with our dispatch via Instagram DM." },
            { step: '03', title: 'Payment & Execution', desc: 'Complete the transaction. Our pilot logs in and executes the mission.' }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/5 rounded-xl p-8 relative overflow-hidden">
              <div className="text-7xl font-black text-white/5 absolute top-4 right-4">{item.step}</div>
              <h3 className="text-xl font-bold mb-3 relative z-10">{item.title}</h3>
              <p className="text-gray-400 text-sm relative z-10">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}