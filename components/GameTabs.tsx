"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Game {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
  services: Service[];
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
}

export default function GameTabs() {
  const [games, setGames] = useState<Game[]>([]);
  const [activeTab, setActiveTab] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data: Game[]) => {
        setGames(data);
        if (data.length > 0) setActiveTab(data[0].id);
      })
      .catch(() => console.error("Gagal fetch games"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-center py-16 text-gray-500">Memuat katalog...</div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        Belum ada layanan tersedia.
      </div>
    );
  }

  const activeGame = games.find((g) => g.id === activeTab);

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {games.map((game) => (
          <button
            key={game.id}
            onClick={() => setActiveTab(game.id)}
            className={`px-6 py-2.5 rounded-full text-sm font-medium border transition-all duration-300 backdrop-blur-sm
              ${
                activeTab === game.id
                  ? "bg-blue-500/20 border-blue-500 text-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
              }`}
          >
            {game.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeGame?.services.map((service) => (
          <div
            key={service.id}
            className="bg-gradient-to-br from-white/5 to-white/[0.01] backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-10 -mt-10 transition duration-500 group-hover:bg-blue-500/20" />

            <h3 className="text-xl font-bold mb-2 text-white relative z-10">
              {service.name}
            </h3>
            <p className="text-gray-400 text-sm mb-6 h-10 relative z-10">
              {service.description || ""}
            </p>

            <div className="flex justify-between items-end mb-6 relative z-10">
              <span className="text-gray-500 text-xs uppercase tracking-wider">
                Mulai dari
              </span>
              <span className="text-2xl font-bold text-white">
                Rp {service.basePrice.toLocaleString("id-ID")}
              </span>
            </div>

            <Link
              href="https://ig.me/m/jokiin.gg"
              target="_blank"
              className="w-full block text-center bg-white/5 hover:bg-blue-500 text-white border border-white/10 hover:border-blue-500 py-3 rounded-md transition font-medium relative z-10"
            >
              Pesan via DM
            </Link>
          </div>
        ))}
        {activeGame?.services.length === 0 && (
          <div className="col-span-full text-center py-10 text-gray-500">
            Belum ada layanan untuk game ini.
          </div>
        )}
      </div>
    </div>
  );
}
