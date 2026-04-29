"use client";

import { useEffect, useState } from "react";

interface Game {
  id: string;
  name: string;
}

interface Service {
  id: string;
  name: string;
  description: string | null;
  basePrice: number;
  gameId: string;
  game: Game;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    basePrice: "",
    gameId: "",
  });

  const fetchData = async () => {
    try {
      const [servicesRes, gamesRes] = await Promise.all([
        fetch("/api/services"),
        fetch("/api/games"),
      ]);
      const [servicesData, gamesData] = await Promise.all([
        servicesRes.json(),
        gamesRes.json(),
      ]);
      setServices(servicesData);
      setGames(gamesData);
    } catch {
      console.error("Gagal fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const resetForm = () => {
    setFormData({ name: "", description: "", basePrice: "", gameId: "" });
    setEditingService(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingService
        ? `/api/services/${editingService.id}`
        : "/api/services";
      const method = editingService ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          basePrice: parseInt(formData.basePrice),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await fetchData();
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description || "",
      basePrice: service.basePrice.toString(),
      gameId: service.gameId,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus layanan "${name}"?`)) return;

    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      await fetchData();
    } catch {
      alert("Gagal menghapus layanan");
    }
  };

  if (loading) {
    return <div className="text-gray-400">Memuat data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kelola Layanan</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-md text-sm font-medium transition"
        >
          {showForm ? "Batal" : "+ Tambah Layanan"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 space-y-4"
        >
          <h2 className="text-lg font-bold mb-2">
            {editingService ? "Edit Layanan" : "Tambah Layanan Baru"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nama Layanan</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="100% Map Exploration"
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-md p-3 text-white outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Game</label>
              <select
                required
                value={formData.gameId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, gameId: e.target.value }))
                }
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-md p-3 text-white outline-none focus:border-blue-500 transition appearance-none"
              >
                <option value="">Pilih Game</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              placeholder="Deskripsi layanan..."
              rows={3}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-md p-3 text-white outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          <div className="max-w-xs">
            <label className="block text-sm text-gray-400 mb-1">Harga (Rp)</label>
            <input
              type="number"
              required
              min="0"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, basePrice: e.target.value }))
              }
              placeholder="150000"
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-md p-3 text-white outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-6 py-2.5 rounded-md text-sm font-medium transition"
          >
            {submitting
              ? "Menyimpan..."
              : editingService
                ? "Update Layanan"
                : "Simpan Layanan"}
          </button>
        </form>
      )}

      {services.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Belum ada layanan. Tambahkan game terlebih dahulu, lalu tambah layanan.
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-white/5 text-gray-300">
              <tr>
                <th className="px-4 py-3">Nama Layanan</th>
                <th className="px-4 py-3">Game</th>
                <th className="px-4 py-3">Harga</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-gray-400">
              {services.map((service) => (
                <tr
                  key={service.id}
                  className="border-b border-white/5 hover:bg-white/5 transition"
                >
                  <td className="px-4 py-4 font-medium text-white">
                    {service.name}
                    {service.description && (
                      <span className="block text-xs text-gray-500 mt-0.5">
                        {service.description}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">{service.game.name}</td>
                  <td className="px-4 py-4">
                    Rp {service.basePrice.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-4 text-right">
                    <button
                      onClick={() => handleEdit(service)}
                      className="text-blue-500 hover:underline mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(service.id, service.name)}
                      className="text-red-400 hover:underline"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
