"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditPollPage() {
  const { pollUrlToEdit } = useParams<{ pollUrlToEdit: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [dateToInit, setDateToInit] = useState("");
  const [dateToEnd, setDateToEnd] = useState("");
  const [options, setOptions] = useState<{ id: number; title: string }[]>([]);

  useEffect(() => {
    const fetchPoll = async () => {
      const res = await fetch(
        `http://localhost:3000/poll/getByUrl/${pollUrlToEdit}`
      );
      const json = await res.json();

      if (json.data) {
        const poll = json.data;
        setTitle(poll.title);
        setDateToInit(poll.dateToInit.slice(0, 16)); // Para datetime-local
        setDateToEnd(poll.dateToEnd.slice(0, 16));
        setOptions(poll.pollResponses);
      }

      setLoading(false);
    };

    fetchPoll();
  }, [pollUrlToEdit]);

  const handleOptionChange = (index: number, value: string) => {
    const updated = [...options];
    updated[index].title = value;
    setOptions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const body = {
      pollEditedBody: {
        title,
        dateToInit: new Date(dateToInit).toISOString(),
        dateToEnd: new Date(dateToEnd).toISOString(),
      },
      pollResponsesEdited: options.map((opt) => ({
        id: opt.id,
        title: opt.title,
      })),
    };

    const res = await fetch(
      `http://localhost:3000/poll/edit/${pollUrlToEdit}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }
    );

    if (res.ok) {
      alert("Enquete atualizada com sucesso!");
      router.push("/");
    } else {
      const error = await res.text();
      alert(`Erro ao atualizar: ${error}`);
    }
  };

  if (loading) return <p className="text-center">Carregando enquete...</p>;

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center">Editar Enquete</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
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
              key={opt.id}
              type="text"
              placeholder={`Opção ${index + 1}`}
              className="w-full border p-2 rounded"
              value={opt.title}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              required
            />
          ))}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Salvar Alterações
        </button>
      </form>
    </main>
  );
}
