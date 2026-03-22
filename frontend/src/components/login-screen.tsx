"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/kinetic";
import { getDashboardPath, loginUser } from "@/lib/auth";

export function LoginScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setSubmitting(true);
    setError("");

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setError("Preencha email e senha para continuar.");
      setSubmitting(false);
      return;
    }

    const result = loginUser({ email, password });

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push(next || getDashboardPath(result.user.role));
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-white/5 bg-[#131313]/80 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
          <Brand />
          <Link
            href="/"
            className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
          >
            Voltar ao inicio
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-3xl px-6 py-12 md:py-16">
        <section className="w-full rounded-[2rem] border border-white/8 bg-surface-container-low p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-10">
          <div className="rounded-[1.75rem] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 md:p-8">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary">
              Acesso
            </p>
            <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-white md:text-4xl">
              Entrar na plataforma
            </h1>
            <p className="mt-3 text-base leading-7 text-on-surface-variant">
              Use o email cadastrado para acessar seu painel e conectar a wallet
              na etapa seguinte.
            </p>

            <form className="mt-8 space-y-5" action={handleSubmit}>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  placeholder="voce@email.com"
                  className="w-full rounded-[1.35rem] border border-white/8 bg-surface-container-lowest px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-primary focus:ring-2 focus:ring-primary/35"
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-white">
                  Senha
                </span>
                <input
                  name="password"
                  type="password"
                  placeholder="Digite sua senha"
                  className="w-full rounded-[1.35rem] border border-white/8 bg-surface-container-lowest px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-primary focus:ring-2 focus:ring-primary/35"
                />
              </label>
              {error ? (
                <div className="rounded-[1.25rem] border border-red-400/20 bg-red-950/30 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}
              <button
                className="w-full rounded-full bg-[linear-gradient(135deg,#6e54ff_0%,#7c4dff_100%)] px-6 py-4 font-headline text-xl font-bold text-white shadow-[0_20px_40px_rgba(110,84,255,0.25)] transition-transform hover:scale-[1.01] disabled:opacity-70"
                disabled={submitting}
              >
                {submitting ? "Entrando..." : "Entrar"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Ainda nao tem conta?{" "}
              <Link href="/cadastro/vencedor" className="font-semibold text-primary">
                Criar cadastro
              </Link>
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
