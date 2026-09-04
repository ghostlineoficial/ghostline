export default function SuccessPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-green-500">
          Pagamento aprovado!
        </h1>

        <p className="mt-6 text-xl">
          Obrigado pela sua compra.
        </p>

        <p className="mt-2 text-gray-400">
          Seu pedido foi recebido com sucesso.
        </p>
      </div>
    </main>
  );
}