"use client";

import { useEffect, useState } from "react";

interface Game {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export default function AdminGamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    imageUrl: "",
  });

  const fetchGames = async () => {
    try {
      const res = await fetch("/api/games");
      const data = await res.json();
      setGames(data);
    } catch {
      console.error("Gagal fetch games");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGames();
  }, []);

  const generateSlug = (name: string) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const resetForm = () => {
    setFormData({ name: "", slug: "", description: "", imageUrl: "" });
    setEditingGame(null);
    setShowForm(false);
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: editingGame ? prev.slug : generateSlug(name),
    }));
  };

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", { method: "POST", body });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      setFormData((prev) => ({ ...prev, imageUrl: data.url }));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal upload gambar");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingGame ? `/api/games/${editingGame.id}` : "/api/games";
      const method = editingGame ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      await fetchGames();
      resetForm();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menyimpan");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      slug: game.slug,
      description: game.description || "",
      imageUrl: game.imageUrl || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus game "${name}"? Semua layanan terkait juga akan terhapus.`)) return;

    try {
      const res = await fetch(`/api/games/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus");
      await fetchGames();
    } catch {
      alert("Gagal menghapus game");
    }
  };

  if (loading) {
    return <div className="text-gray-400">Memuat data...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kelola Game</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          className="bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-md text-sm font-medium transition"
        >
          {showForm ? "Batal" : "+ Tambah Game"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 space-y-4"
        >
          <h2 className="text-lg font-bold mb-2">
            {editingGame ? "Edit Game" : "Tambah Game Baru"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Nama Game</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Wuthering Waves"
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-md p-3 text-white outline-none focus:border-blue-500 transition"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Slug</label>
              <input
                type="text"
                required
                value={formData.slug}
                onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                placeholder="wuthering-waves"
                className="w-full bg-[#0A0A0A] border border-white/10 rounded-md p-3 text-white outline-none focus:border-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Deskripsi singkat game..."
              rows={3}
              className="w-full bg-[#0A0A0A] border border-white/10 rounded-md p-3 text-white outline-none focus:border-blue-500 transition resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Gambar Game</label>
            <div className="flex items-center gap-4">
              <label className="cursor-pointer bg-white/10 hover:bg-white/20 px-4 py-2.5 rounded-md text-sm transition">
                {uploading ? "Mengupload..." : "Pilih File"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                  }}
                />
              </label>
              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-16 h-16 rounded-md object-cover border border-white/10"
                />
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting || uploading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-6 py-2.5 rounded-md text-sm font-medium transition"
          >
            {submitting ? "Menyimpan..." : editingGame ? "Update Game" : "Simpan Game"}
          </button>
        </form>
      )}

      {games.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          Belum ada game. Klik &quot;+ Tambah Game&quot; untuk memulai.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden group hover:border-blue-500/50 transition"
            >
              {game.imageUrl ? (
                <img
                  src={game.imageUrl}
                  alt={game.name}
                  className="w-full h-40 object-cover"
                />
              ) : (
                <div className="w-full h-40 bg-white/5 flex items-center justify-center text-gray-600 text-sm">
                  No Image
                </div>
              )}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-1">{game.name}</h3>
                <p className="text-gray-500 text-xs mb-3">/{game.slug}</p>
                {game.description && (
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{game.description}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(game)}
                    className="text-blue-500 hover:underline text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(game.id, game.name)}
                    className="text-red-400 hover:underline text-sm"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
