import { redirect } from "next/navigation";

export default async function loginPage() {
  const goToHome = async () => {
    redirect("/home");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-50 antialiased selection:bg-amber-500/30">
      <main className="flex min-h-screen items-center justify-center">
        <h1>Você já está logado. Redirecionando para a página inicial...</h1>
        {goToHome()}
      </main>
    </div>
  );
}
