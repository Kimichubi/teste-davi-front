"use client";

import Link from "next/link";
import { useState } from "react";

export default function CreatePollForm() {
  const [title, setTitle] = useState("");
  const [dateToInit, setDateToInit] = useState("");
  const [dateToEnd, setDateToEnd] = useState("");
  const [options, setOptions] = useState(["", "", ""]);
  const [editUrl, setEditUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      pollBody: {
        title,
        dateToInit: new Date(dateToInit).toISOString(),
        dateToEnd: new Date(dateToEnd).toISOString(),
      },
      pollResponse: options
        .filter((opt) => opt.trim() !== "")
        .map((title) => ({ title })),
    };

    const res = await fetch("http://localhost:3000/poll", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      setEditUrl(`http://localhost:3001/editPoll/${data.urlToEdit}`);
      alert("Enquete criada com sucesso!");
      setTitle("");
      setDateToInit("");
      setDateToEnd("");
      setOptions(["", "", ""]);
    } else {
      const error = await res.text();
      alert(`Erro: ${error}`);
    }
  };

  const handleOptionChange = (value: string, index: number) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  return (
    <>
      <Link href={"/"} className="text-blue-600 hover:underline block mb-4">
        Voltar
      </Link>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Criar Nova Enquete</h2>

        <input
          type="text"
          placeholder="Título da Enquete"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div className="flex gap-4">
          <input
            type="datetime-local"
            className="w-1/2 border p-2 rounded"
            value={dateToInit}
            onChange={(e) => setDateToInit(e.target.value)}
            required
          />
          <input
            type="datetime-local"
            className="w-1/2 border p-2 rounded"
            value={dateToEnd}
            onChange={(e) => setDateToEnd(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          {options.map((opt, index) => (
            <input
              key={index}
              type="text"
              placeholder={`Opção ${index + 1}`}
              className="w-full border p-2 rounded"
              value={opt}
              onChange={(e) => handleOptionChange(e.target.value, index)}
              required
            />
          ))}
          <button
            type="button"
            className="text-blue-600 hover:underline text-sm"
            onClick={() => setOptions([...options, ""])}
          >
            + Adicionar opção
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Criar Enquete
        </button>
      </form>

      {editUrl && (
        <div className="max-w-xl mx-auto mt-6 p-4 bg-green-100 border border-green-400 text-green-800 rounded shadow">
          <p className="font-semibold">Parabéns! Sua enquete foi criada.</p>
          <p>
            Para editar no futuro, acesse:
            <br />
            <a
              href={editUrl}
              className="text-blue-700 underline"
              target="_blank"
            >
              {editUrl}
            </a>
          </p>
        </div>
      )}
    </>
  );
}
