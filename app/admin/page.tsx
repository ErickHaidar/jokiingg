"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Game {
  id: string;
  name: string;
  services: { id: string }[];
}

interface Service {
  id: string;
  name: string;
  basePrice: number;
  game: { name: string };
}

export default function AdminDashboard() {
  const [games, setGames] = useState<Game[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/games").then((r) => r.json()),
      fetch("/api/services").then((r) => r.json()),
    ])
      .then(([gamesData, servicesData]) => {
        setGames(gamesData);
        setServices(servicesData);
      })
      .catch(() => console.error("Gagal fetch dashboard data"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-gray-400">Memuat dashboard...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-10">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Link
          href="/admin/games"
          className="bg-white/5 border border-white/10 rounded-xl p-6 border-l-4 border-l-blue-500 hover:bg-white/10 transition"
        >
          <div className="text-gray-400 text-sm">Total Game</div>
          <div className="text-3xl font-bold mt-2">{games.length}</div>
        </Link>
        <Link
          href="/admin/services"
          className="bg-white/5 border border-white/10 rounded-xl p-6 border-l-4 border-l-yellow-400 hover:bg-white/10 transition"
        >
          <div className="text-gray-400 text-sm">Total Layanan</div>
          <div className="text-3xl font-bold mt-2">{services.length}</div>
        </Link>
      </div>

      <div className="bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-6">Layanan Terbaru</h2>

        {services.length === 0 ? (
          <p className="text-gray-500 text-sm">Belum ada layanan.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="text-xs uppercase bg-white/5 text-gray-300">
                <tr>
                  <th className="px-4 py-3 rounded-tl-md">Nama Layanan</th>
                  <th className="px-4 py-3">Game</th>
                  <th className="px-4 py-3 rounded-tr-md">Harga</th>
                </tr>
              </thead>
              <tbody>
                {services.slice(0, 10).map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="px-4 py-4 font-medium text-white">
                      {service.name}
                    </td>
                    <td className="px-4 py-4">{service.game.name}</td>
                    <td className="px-4 py-4">
                      Rp {service.basePrice.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
