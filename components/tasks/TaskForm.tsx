"use client";
import { useState } from "react";
import { motion } from "framer-motion";

export default function TaskForm({ onAdd }: { onAdd: (title: string) => void }) {
  const [value, setValue] = useState("");

  const submit = () => {
    const title = value.trim();
    if (!title) return;
    onAdd(title);
    setValue("");
  };

  return (
    <div className="bg-white dark:bg-neutral-900 p-8 sm:p-10 rounded-[2.5rem] sm:rounded-[3.5rem] border border-slate-200/60 dark:border-white/5 shadow-xl shadow-blue-500/5 transition-all">
      <label className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-6 block ml-2">
        Yeni Görev Tanımla
      </label>
      
      <div className="flex flex-col gap-6">
        <input
          type="text"
          placeholder="Bugün ne yapıyoruz?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          className="w-full bg-transparent text-2xl sm:text-3xl font-bold outline-none text-slate-900 dark:text-white placeholder:text-slate-200 dark:placeholder:text-white/10 px-2"
        />

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={submit}
          className="w-full py-5 sm:py-6 bg-blue-600 text-white rounded-[1.5rem] sm:rounded-[2rem] font-black italic uppercase tracking-widest shadow-lg shadow-blue-600/25 hover:bg-blue-700 transition-all text-sm"
        >
          LİSTEYE EKLE
        </motion.button>
      </div>
    </div>
  );
}