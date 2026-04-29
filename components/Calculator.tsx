"use client";

import { useState } from "react";

export default function Calculator() {
  const [selectedGame, setSelectedGame] = useState("WuWa");
  const [targetLevel, setTargetLevel] = useState<number | "">("");

  // Simulasi harga per level (Bisa diambil dari database nantinya)
  const pricePerLevel: Record<string, number> = {
    WuWa: 5000, // Rp 5.000 per Union Level
    Genshin: 4000, // Rp 4.000 per AR Level
    HSR: 4500, // Rp 4.500 per Trailblaze Level
  };

  const calculatePrice = () => {
    if (!targetLevel || targetLevel <= 0) return 0;
    return targetLevel * pricePerLevel[selectedGame];
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-2xl p-8 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
      {/* Efek Glow */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <span className="text-yellow-400">⚡</span> Kalkulator Joki Leveling
      </h2>
      
      <div className="flex flex-col md:flex-row gap-4 items-end relative z-10">
        <div className="flex-1 w-full">
          <label className="block text-sm text-gray-400 mb-2">Pilih Game</label>
          <select 
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-md p-3 text-white outline-none focus:border-blue-500 transition appearance-none"
          >
            <option value="WuWa">Wuthering Waves (Union Level)</option>
            <option value="Genshin">Genshin Impact (AR Level)</option>
            <option value="HSR">Honkai Star Rail (TB Level)</option>
          </select>
        </div>
        
        <div className="w-full md:w-40">
          <label className="block text-sm text-gray-400 mb-2">Total Leveling</label>
          <input 
            type="number" 
            placeholder="Misal: 10" 
            value={targetLevel}
            onChange={(e) => setTargetLevel(parseInt(e.target.value) || "")}
            className="w-full bg-[#0A0A0A] border border-white/10 rounded-md p-3 text-white outline-none focus:border-blue-500 transition" 
          />
        </div>
        
        <div className="w-full md:w-auto bg-white/5 rounded-md p-3 border border-white/5 min-w-[150px]">
          <div className="text-sm text-gray-400 mb-1">Estimasi Harga</div>
          <div className="text-2xl font-bold text-blue-500">
            Rp {calculatePrice().toLocaleString('id-ID')}
          </div>
        </div>
      </div>
    </div>
  );
}