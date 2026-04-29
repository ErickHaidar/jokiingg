"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Game {
  id: string;
  name: string;
  slug: string;
  description: string | null;
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
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/games")
      .then((res) => res.json())
      .then((data: Game[]) => setGames(data))
      .catch(() => console.error("Gagal fetch games"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedGame(null);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  useEffect(() => {
    if (selectedGame) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedGame]);

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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <button
            key={game.id}
            className="text-left rounded-xl overflow-hidden border border-white/10 hover:border-blue-500 transition-all duration-300 group hover:shadow-[0_0_15px_rgba(59,130,246,0.3)] bg-white/5"
            onClick={() => setSelectedGame(game)}
          >
            <div className="relative">
              {game.imageUrl ? (
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-40 bg-white/5 flex items-center justify-center text-gray-600 text-sm">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <div className="absolute bottom-0 left-0 p-4 w-full">
                <h3 className="font-bold text-lg text-white group-hover:text-blue-400 transition-colors">
                  {game.name}
                </h3>
              </div>
            </div>
            
            <div className="p-4 bg-[#0A0A0A]">
              {game.description && (
                <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                  {game.description}
                </p>
              )}
              <div className="flex items-center justify-between mt-auto">
                <span className="text-gray-500 text-xs">
                  {game.services.length} Layanan
                </span>
                <span className="text-blue-500 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Lihat Paket →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedGame && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setSelectedGame(null)}
        >
          <div 
            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative md:w-2/5 shrink-0 bg-[#0A0A0A]">
              {selectedGame.imageUrl ? (
                <img
                  src={selectedGame.imageUrl}
                  alt={selectedGame.name}
                  className="w-full h-48 md:h-full object-cover"
                />
              ) : (
                <div className="w-full h-48 md:h-full flex items-center justify-center text-gray-600">
                  No Image
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-black/50 md:bg-gradient-to-r md:from-transparent md:to-[#111]" />
              
              <button 
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 right-4 md:left-4 md:right-auto bg-black/50 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-600 transition z-10"
              >
                ✕
              </button>

              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full z-10">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedGame.name}</h2>
                <p className="text-gray-400 text-sm">{selectedGame.description}</p>
              </div>
            </div>

            <div className="flex-1 flex flex-col max-h-[50vh] md:max-h-[90vh]">
              <div className="p-6 border-b border-white/5 shrink-0">
                <h3 className="text-lg font-bold text-white">Pilih Layanan Joki</h3>
                <p className="text-sm text-gray-400 mt-1">Pilih paket layanan yang sesuai untuk {selectedGame.name}</p>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                {selectedGame.services.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    Belum ada layanan untuk game ini.
                  </div>
                ) : (
                  selectedGame.services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-blue-500/50 hover:bg-white/10 transition group"
                    >
                      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-base mb-1">
                            {service.name}
                          </h4>
                          {service.description && (
                            <p className="text-gray-400 text-sm">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <div className="sm:text-right shrink-0 bg-black/40 px-3 py-2 rounded-lg sm:bg-transparent sm:p-0">
                          <span className="text-gray-500 text-xs uppercase tracking-wider block mb-1 sm:mb-0">
                            Harga
                          </span>
                          <span className="text-blue-400 font-bold text-lg">
                            Rp {service.basePrice.toLocaleString("id-ID")}
                          </span>
                        </div>
                      </div>
                      
                      <Link
                        href="https://ig.me/m/jokiin.gg"
                        target="_blank"
                        className="mt-4 w-full block text-center bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-600/50 py-2.5 rounded-lg transition font-medium"
                      >
                        Pesan via DM Sekarang
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
