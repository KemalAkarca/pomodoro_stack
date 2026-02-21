"use client";
// Bu component input state'i kullanacağı için client component

import { useState } from "react";

// Bu component dışarıya "yeni task eklenecek" bilgisini verir
// Yani parent (TasksPageView) bu componentten gelen task title'ı alıp listeye ekler.
export default function TaskForm({
  onAdd,
}: {
  onAdd: (title: string) => void;
}) {
  // Input içindeki metni tutuyoruz
  const [value, setValue] = useState("");

  // Task ekleme fonksiyonu
  const submit = () => {
    const title = value.trim();
    if (!title) return; // boş ekleme

    onAdd(title); // parent'a gönder
    setValue(""); // input temizle
  };

  return (
    <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_auto]">

      <input
        type="text"
        placeholder="Add a new task..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
        // Enter'a basınca ekle
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />

      <button
        onClick={submit}
className="w-full rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.99] sm:w-auto"
      >
        Add
      </button>
    </div>
  );
}
