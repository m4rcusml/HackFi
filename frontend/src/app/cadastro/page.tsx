import Link from "next/link";
import { AuthLayout } from "@/components/auth";
import { Icon } from "@/components/kinetic";

const cards = [
  {
    title: "Quero antecipar meu premio",
    text: "Para vencedores de hackathons que querem transformar um premio futuro em liquidez agora.",
    href: "/cadastro/vencedor",
    icon: "military_tech",
  },
  {
    title: "Quero investir em premios",
    text: "Para investidores que querem comprar fracoes de premios verificados com desconto.",
    href: "/cadastro/investidor",
    icon: "monitoring",
  },
  {
    title: "Quero operar o hackathon",
    text: "Para organizadores e operadores responsaveis por validar vencedores e liquidar premios.",
    href: "/cadastro/admin",
    icon: "admin_panel_settings",
  },
];

export default function CadastroHubPage() {
  return (
    <AuthLayout
      eyebrow="Escolha seu perfil"
      title="Como voce entra no HackFi?"
      subtitle="Cada persona tem um fluxo proprio. Escolha o perfil que melhor representa seu papel no ciclo de antecipacao de premios."
      highlights={[
        { title: "Vencedor", text: "Cria a antecipacao e recebe liquidez antes do pagamento final." },
        { title: "Investidor", text: "Compra recibos fracionados e recebe o claim na liquidacao." },
        { title: "Admin", text: "Valida, ativa e liquida as ofertas vinculadas ao hackathon." },
      ]}
    >
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-[1.5rem] border border-white/8 bg-surface-container-lowest p-6 transition-all hover:-translate-y-0.5 hover:border-primary/35"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
              <Icon name={card.icon} className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-5 font-headline text-xl font-bold text-white">{card.title}</h2>
            <p className="mt-3 text-sm leading-7 text-on-surface-variant">{card.text}</p>
            <span className="mt-6 inline-flex text-sm font-semibold text-primary">
              Continuar
            </span>
          </Link>
        ))}
      </div>
    </AuthLayout>
  );
}
