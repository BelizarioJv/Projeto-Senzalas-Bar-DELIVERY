import Link from "next/link";

const messages = {
  aprovado: {
    title: "Pagamento aprovado",
    description: "Seu pedido foi recebido e será preparado.",
  },
  falhou: {
    title: "Pagamento não concluído",
    description: "Tente novamente ou escolha outra forma de pagamento.",
  },
  pendente: {
    title: "Pagamento pendente",
    description:
      "Assim que o pagamento for confirmado, processaremos o pedido.",
  },
} as const;

//Página de status do pagamento, exibindo mensagens diferentes dependendo do status do pagamento
export default async function PaymentStatusPage({
  params,
}: {
  params: Promise<{ status: keyof typeof messages }>;
}) {
  const { status } = await params;
  const message = messages[status] ?? messages.falhou;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-semibold">{message.title}</h1>
        <p className="mt-3 text-muted-foreground">{message.description}</p>
        <Link className="mt-6 inline-block underline" href="/home">
          Voltar ao cardápio
        </Link>
      </div>
    </main>
  );
}
