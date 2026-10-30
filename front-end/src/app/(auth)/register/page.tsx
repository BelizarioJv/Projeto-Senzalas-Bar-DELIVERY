"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { register, loginWithGoogle } from "@/app/actions/auth";
import { BeerGlass } from "@/components/ui/brand/beer-glass";
import { EyeIcon, GoogleIcon } from "@/components/ui/icons/auth-icons";

const APP_NAME = "Sua Marca";

const inputClass =
  "h-11 w-full rounded-lg border border-input bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-60";

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(register, null);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-4 text-foreground sm:p-8">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-border bg-background shadow-2xl shadow-black/10 lg:min-h-[42rem] lg:grid-cols-[1.05fr_1fr]">
        <aside className="dark relative hidden flex-col justify-between overflow-hidden bg-background p-10 text-foreground lg:flex">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 size-[26rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl"
          />

          <p className="relative font-heading text-2xl font-semibold tracking-tight text-primary">
            {APP_NAME}
          </p>

          <div className="relative flex flex-col items-center gap-8">
            <BeerGlass className="h-auto w-full max-w-[14rem]" />
            <div className="max-w-sm text-center">
              <h2 className="font-heading text-3xl font-semibold leading-tight tracking-tight text-balance">
                Seu pedido favorito a um clique.
              </h2>
              <p className="mt-3 text-pretty text-sm text-muted-foreground">
                Crie sua conta para salvar seus dados e acompanhar entregas.
              </p>
            </div>
          </div>

          <p className="relative text-sm text-muted-foreground">
            Bebida alcoólica não é para menores de 18 anos.
          </p>
        </aside>

        <section className="flex items-center justify-center px-6 py-10 sm:px-12">
          <div className="w-full max-w-sm">
            <p className="mb-8 font-heading text-xl font-semibold tracking-tight lg:hidden">
              <span className="mr-2 inline-block size-2.5 rounded-full bg-primary align-middle" />
              {APP_NAME}
            </p>

            <h1 className="font-heading text-3xl font-semibold tracking-tight">
              Criar conta
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Cadastre-se para começar a fazer pedidos.
            </p>

            {state?.error && (
              <p
                role="alert"
                className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
                {state.error}
              </p>
            )}

            {state?.success && (
              <p
                role="status"
                className="mt-6 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-700 dark:text-emerald-300">
                {state.success}
              </p>
            )}

            <form action={formAction} className="mt-6 space-y-5">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Nome
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  minLength={2}
                  maxLength={100}
                  placeholder="Seu nome"
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  Telefone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="(99) 99999-9999"
                  pattern="\(\d{2}\) \d{5}-\d{4}"
                  required
                  className={inputClass}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Senha
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    minLength={8}
                    maxLength={72}
                    required
                    className={`${inputClass} pr-11`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={
                      showPassword ? "Ocultar senha" : "Mostrar senha"
                    }
                    aria-pressed={showPassword}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
                    <EyeIcon off={showPassword} />
                  </button>
                </div>

                <ul className="mt-2 text-xs text-muted-foreground">
                  <li>• Pelo menos 8 caracteres</li>
                  <li>• Pelo menos uma letra maiúscula</li>
                  <li>• Pelo menos uma letra minúscula</li>
                  <li>• Pelo menos um número</li>
                </ul>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="flex h-11 w-full items-center justify-center rounded-lg bg-primary text-sm font-semibold text-neutral-950 transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/40 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70">
                {isPending ? "Criando conta..." : "Criar conta"}
              </button>
            </form>

            <div className="my-6 flex items-center gap-4" aria-hidden="true">
              <span className="h-px flex-1 bg-border" />
              <span className="text-sm text-muted-foreground">ou</span>
              <span className="h-px flex-1 bg-border" />
            </div>

            <form action={loginWithGoogle}>
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-input bg-card text-sm font-medium transition-colors hover:bg-muted/60 focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none">
                <GoogleIcon />
                Continuar com Google
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link
                href="/login"
                className="font-medium text-foreground underline decoration-primary decoration-2 underline-offset-4">
                Entrar
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
