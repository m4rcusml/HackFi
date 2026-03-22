import { AuthForm, AuthLayout } from "@/components/auth";

const fields = [
  { name: "fullName", label: "Nome completo", placeholder: "Seu nome ou nome do fundo", full: true },
  { name: "email", label: "Email", placeholder: "investidor@fundo.io", type: "email" as const },
  { name: "capital", label: "Capital inicial", placeholder: "Ex.: 50000", type: "number" as const },
  { name: "riskProfile", label: "Perfil de risco", placeholder: "Conservador, balaceado ou agressivo"},
  { name: "password", label: "Senha", placeholder: "Crie uma senha segura", type: "password" as const, full: true },
];

export default function CadastroInvestidorPage() {
  return (
    <AuthLayout
      eyebrow="Onboarding do investidor"
      title="Criar conta de investidor"
      subtitle="Cadastre seu perfil para receber oportunidades alinhadas com sua tese, faixa de capital e expectativa de retorno."
      highlights={[
        {
          title: "Tese de investimento",
          text: "Defina os setores e tipos de oportunidade que quer acompanhar.",
        },
        {
          title: "Capital e risco",
          text: "Informe sua faixa de alocacao e o perfil de risco esperado.",
        },
        {
          title: "Liquidez desejada",
          text: "Ajuda a filtrar pools de premio por prazo e janela de retorno.",
        },
      ]}
    >
      <AuthForm
        role="investidor"
        fields={fields}
        cta="Criar conta"
        helper="A carteira pode ser conectada depois da criacao do perfil."
      />
    </AuthLayout>
  );
}
