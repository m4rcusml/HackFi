"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { useRouter } from "next/navigation";
import { Brand, Icon } from "@/components/kinetic";
import { getDashboardPath, registerUser, UserRole } from "@/lib/auth";

export type AuthField = {
  name: string;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password" | "number";
  full?: boolean;
};

type Highlight = {
  title: string;
  text: string;
};

export function AuthLayout({
  title,
  subtitle,
  eyebrow,
  highlights,
  children,
}: {
  title: string;
  subtitle: string;
  eyebrow: string;
  highlights?: Highlight[];
  children: ReactNode;
}) {
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
      <main className="mx-auto max-w-5xl px-6 py-10 md:py-14">
        <section className="rounded-[2rem] border border-white/8 bg-surface-container-low p-6 shadow-[0_20px_60px_rgba(0,0,0,0.25)] md:p-10">
          <div className="rounded-[1.75rem] border border-white/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.015))] p-6 md:p-8">
            <div className="flex items-start justify-between gap-4">
              <div className="max-w-3xl">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary">
                  {eyebrow}
                </p>
                <h1 className="mt-4 font-headline text-3xl font-black tracking-tight text-white md:text-4xl">
                  {title}
                </h1>
                <p className="mt-3 text-base leading-7 text-on-surface-variant">
                  {subtitle}
                </p>
              </div>
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary md:flex">
                <Icon name="verified" className="h-7 w-7" />
              </div>
            </div>

            {highlights?.length ? (
              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {highlights.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.35rem] border border-white/6 bg-white/[0.03] p-4"
                  >
                    <h2 className="font-headline text-base font-bold text-white">
                      {item.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-on-surface-variant">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            ) : null}

            {children}
          </div>
        </section>
      </main>
    </div>
  );
}

export function AuthForm({
  role,
  fields,
  cta,
  helper,
}: {
  role: UserRole;
  fields: AuthField[];
  cta: string;
  helper: string;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setSubmitting(true);

    const values = Object.fromEntries(
      fields.map((field) => [field.name, String(formData.get(field.name) ?? "").trim()]),
    ) as Record<string, string>;

    const name = values.fullName;
    const email = values.email;
    const password = values.password;

    if (!name || !email || !password) {
      setError("Preencha nome, email e senha para continuar.");
      setSubmitting(false);
      return;
    }

    const profile = Object.fromEntries(
      Object.entries(values).filter(([key]) => !["fullName", "email", "password"].includes(key)),
    );

    const result = registerUser({
      role,
      name,
      email,
      password,
      profile,
    });

    if (!result.ok) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    router.push(getDashboardPath(role));
  }

  return (
    <form className="mt-8 space-y-6" action={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <label
            key={field.name}
            className={field.full ? "md:col-span-2" : undefined}
          >
            <span className="mb-2 block text-sm font-semibold text-white">
              {field.label}
            </span>
            <input
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              className="w-full rounded-[1.35rem] border border-white/8 bg-surface-container-lowest px-5 py-4 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-primary focus:ring-2 focus:ring-primary/35"
            />
          </label>
        ))}
      </div>
      {error ? (
        <div className="rounded-[1.25rem] border border-red-400/20 bg-red-950/30 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}
      <button
        className="w-full rounded-full bg-[linear-gradient(135deg,#6e54ff_0%,#7c4dff_100%)] px-6 py-4 font-headline text-xl font-bold text-white shadow-[0_20px_40px_rgba(110,84,255,0.25)] transition-transform hover:scale-[1.01] disabled:opacity-70"
        disabled={submitting}
      >
        {submitting ? "Criando conta..." : cta}
      </button>
      <div className="flex flex-col items-center justify-center gap-3 text-center sm:flex-row">
        <p className="text-sm text-zinc-500">Ja tem conta?</p>
        <Link
          href="/login"
          className="inline-flex items-center justify-center rounded-full border border-primary/30 bg-primary/12 px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
        >
          Entrar
        </Link>
      </div>
      <div className="rounded-[1.25rem] border border-white/6 bg-white/[0.02] px-4 py-3 text-center">
        <p className="text-xs uppercase tracking-[0.18em] text-zinc-600">{helper}</p>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
          Perfil: {role}
        </p>
      </div>
    </form>
  );
}
