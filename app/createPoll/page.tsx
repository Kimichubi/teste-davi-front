import Link from "next/link";

export default function CreatePoll() {
  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <Link href={"/"}>Voltar</Link>
        <h1 className="text-2xl font-bold mb-6">
          Bem-vindo ao seu gerador de enquetes
        </h1>
        <form
          method="POST"
          className="bg-white p-6 rounded-2xl shadow-md w-full max-w-md space-y-4"
        >
          <div>
            <label className="block font-medium mb-1" htmlFor="title">
              Título da Enquete
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="dateToInit">
              Data para Iniciar
            </label>
            <input
              type="datetime-local"
              id="dateToInit"
              name="dateToInit"
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1" htmlFor="dateToEnd">
              Data para Encerrar
            </label>
            <input
              type="datetime-local"
              id="dateToEnd"
              name="dateToEnd"
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Respostas</label>
            <input
              type="text"
              name="response1"
              placeholder="Resposta 1"
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
              required
            />
            <input
              type="text"
              name="response2"
              placeholder="Resposta 2"
              className="w-full border border-gray-300 rounded-lg p-2 mb-2"
              required
            />
            <input
              type="text"
              name="response3"
              placeholder="Resposta 3"
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          >
            Criar Enquete
          </button>
        </form>
      </main>
    </>
  );
}
