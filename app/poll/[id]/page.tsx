"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import PollData from "@/types/Poll";

export default function ViewAndVotePoll() {
  const { id } = useParams();
  const router = useRouter();
  const [poll, setPoll] = useState<PollData | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      const res = await fetch(`http://localhost:3000/poll/${id}`);
      const json = await res.json();
      setPoll(json.data);
    };
    fetchPoll();
  }, [id]);

  const handleVote = async (responseId: number) => {
    await fetch(`http://localhost:3000/poll/vote/${responseId}`);

    const res = await fetch(`http://localhost:3000/poll/${id}`);
    const json = await res.json();
    setPoll(json.data);
  };

  if (!poll) return <p className="text-center mt-10">Carregando enquete...</p>;

  const now = new Date();
  const start = new Date(poll.dateToInit);
  const end = new Date(poll.dateToEnd);
  const isActive = now >= start && now <= end;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-2 text-center">{poll.title}</h1>
        <p className="text-center text-sm text-gray-500 mb-4">
          {start.toLocaleDateString()} até {end.toLocaleDateString()}
        </p>

        {!isActive && (
          <p className="text-center text-red-500 font-semibold mb-4">
            {now < start
              ? "Esta enquete ainda não começou."
              : "Esta enquete já foi encerrada."}
          </p>
        )}

        <ul className="space-y-4">
          {poll.pollResponses.map((response) => (
            <li
              key={response.id}
              className="flex items-center justify-between border p-3 rounded-lg"
            >
              <span className="font-medium">{response.title}</span>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {response.vote} voto(s)
                </span>
                {isActive && (
                  <button
                    onClick={() => handleVote(response.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Votar
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>

        <button
          onClick={() => router.back()}
          className="mt-6 block mx-auto text-sm text-blue-500 hover:underline"
        >
          Voltar
        </button>
      </div>
    </main>
  );
}
