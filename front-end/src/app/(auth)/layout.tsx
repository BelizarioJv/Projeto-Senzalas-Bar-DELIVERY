import { Toaster } from "@/components/ui/sonner";
import "../globals.css";
interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 antialiased selection:bg-amber-500/30">
      {/* Container principal que centraliza o formulário de login */}
      <main className="flex min-h-screen items-center justify-center">
        {children}
      </main>

      {/* Provider do Toast que vai escutar os disparos da página de login */}
      <Toaster richColors closeButton position="top-right" />
    </div>
  );
}
