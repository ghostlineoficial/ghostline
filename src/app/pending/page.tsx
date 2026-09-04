export default function PendingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-yellow-400">
          Pagamento pendente
        </h1>

        <p className="mt-6 text-xl">
          Estamos aguardando a confirmação do pagamento.
        </p>

        <p className="mt-2 text-gray-400">
          Assim que ele for aprovado, seu pedido será processado.
        </p>
      </div>
    </main>
  );
}