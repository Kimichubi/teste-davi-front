"use client";

import { Poll } from "@/types/Poll";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchPolls = async () => {
      const data = await fetch(`http://localhost:3000/poll?page=${page}`).then(
        (res) => res.json()
      );
      setPolls(data);
    };
    fetchPolls();

    const interval = setInterval(fetchPolls, 5000);
    return () => clearInterval(interval);
  }, [page]);

  const now = new Date();

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <Link href={"/createPoll"}>Criar Enquete</Link>
      <h1 className="text-2xl font-bold mb-6 text-center">Lista de Enquetes</h1>
      <div className="grid gap-6 max-w-4xl mx-auto">
        {polls.map((poll) => {
          const start = new Date(poll.dateToInit);
          const end = new Date(poll.dateToEnd);
          const status = now < start ? "future" : now > end ? "past" : "active";

          const statusText =
            status === "future"
              ? "Ainda não começou"
              : status === "past"
              ? "Enquete encerrada"
              : "Enquete ativa";

          const cardClass =
            status === "future"
              ? "bg-yellow-100"
              : status === "past"
              ? "bg-gray-200"
              : "bg-white";

          return (
            <div
              key={poll.id}
              className={`${cardClass} p-4 rounded-2xl shadow flex flex-col gap-2`}
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">{poll.title}</h2>
                <span className="text-sm text-gray-500">
                  {start.toLocaleDateString()} - {end.toLocaleDateString()}
                </span>
              </div>

              <div className="text-sm text-gray-600 italic">{statusText}</div>

              <div className="text-sm text-gray-600">
                Total de Respostas: {poll._count?.pollResponses || 0}
              </div>

              <ul className="mt-2 space-y-1">
                {poll.pollResponses.map((response) => (
                  <li key={response.id} className="text-gray-800">
                    {response.title} —{" "}
                    <span className="font-medium">{response.vote} voto(s)</span>
                  </li>
                ))}
              </ul>

              <Link
                href={`/poll/${poll.id}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-center hover:bg-blue-700 transition"
              >
                Votar nesta Enquete
              </Link>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Anterior
        </button>
        <span className="self-center font-semibold">Página {page}</span>
        {polls.length === 10 ? (
          <button
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Próxima
          </button>
        ) : (
          <button
            disabled={true}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 disabled:"
          >
            Próxima
          </button>
        )}
      </div>
    </main>
  );
}
