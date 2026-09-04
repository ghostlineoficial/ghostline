export default function FailurePage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-red-500">
          Pagamento recusado
        </h1>

        <p className="mt-6 text-xl">
          Infelizmente seu pagamento não foi aprovado.
        </p>

        <p className="mt-2 text-gray-400">
          Tente novamente usando outro método de pagamento.
        </p>
      </div>
    </main>
  );
}