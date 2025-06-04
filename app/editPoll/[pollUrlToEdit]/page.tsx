"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PollData from "@/types/Poll";

export default function EditPollPage() {
  const { pollUrlToEdit } = useParams<{ pollUrlToEdit: string }>();
  const router = useRouter();

  const [poll, setPoll] = useState<PollData>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPoll = async () => {
      const res = await fetch(
        `http://localhost:3000/poll/getByUrl/${pollUrlToEdit}`
      );
      const json = await res.json();
      setPoll(json.data);
      setLoading(false);
    };
    fetchPoll();
  }, [pollUrlToEdit]);

  const handleChange = (index: number, value: string) => {
    const updated = [...poll!.pollResponses];
    updated[index].title = value;
    setPoll({ ...poll!, pollResponses: updated });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const body = {
      pollEditedBody: {
        title: poll!.title,
        dateToInit: poll!.dateToInit,
        dateToEnd: poll!.dateToEnd,
      },
      pollResponsesEdited: poll!.pollResponses.map((r: any) => ({
        id: r.id,
        title: r.title,
      })),
    };

    const res = await fetch(`/poll/edit/${pollUrlToEdit}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      alert("Enquete atualizada com sucesso!");
      router.push("/");
    } else {
      alert("Erro ao atualizar.");
    }
  };

  if (loading) return <p>Carregando enquete...</p>;
  if (!poll) return <p>Enquete não encontrada</p>;

  return (
    <main className="max-w-xl mx-auto p-6 bg-white rounded shadow mt-8">
      <h1 className="text-2xl font-bold mb-4">Editar Enquete</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block">
          Título:
          <input
            type="text"
            value={poll.title}
            onChange={(e) => setPoll({ ...poll, title: e.target.value })}
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          Data de Início:
          <input
            type="datetime-local"
            value={poll.dateToInit.slice(0, 16)}
            onChange={(e) =>
              setPoll({
                ...poll,
                dateToInit: new Date(e.target.value).toISOString(),
              })
            }
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <label className="block">
          Data de Fim:
          <input
            type="datetime-local"
            value={poll.dateToEnd.slice(0, 16)}
            onChange={(e) =>
              setPoll({
                ...poll,
                dateToEnd: new Date(e.target.value).toISOString(),
              })
            }
            className="w-full p-2 border rounded mt-1"
          />
        </label>

        <div>
          <p className="font-semibold">Respostas:</p>
          {poll.pollResponses.map((resp: any, idx: number) => (
            <input
              key={resp.id}
              type="text"
              value={resp.title}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-full p-2 border rounded mt-2"
            />
          ))}
        </div>

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Salvar Alterações
        </button>
      </form>
    </main>
  );
}
