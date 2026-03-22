import { AuthForm, AuthLayout } from "@/components/auth";

const fields = [
  { name: "fullName", label: "Nome completo", placeholder: "Seu nome completo", full: true },
  { name: "email", label: "Email", placeholder: "voce@email.com", type: "email" as const },
  { name: "hackathon", label: "Hackathon", placeholder: "Nome do hackathon" },
  { name: "prizeCategory", label: "Categoria do premio", placeholder: "DeFi, Infra, IA..." },
  { name: "prizeValue", label: "Valor do premio (USD)", placeholder: "Ex.: 10000", type: "number" as const },
  { name: "projectLink", label: "Link do projeto", placeholder: "Github, demo ou pitch deck", full: true },
  { name: "password", label: "Senha", placeholder: "Crie uma senha segura", type: "password" as const, full: true },
];

export default function CadastroVencedorPage() {
  return (
    <AuthLayout
      eyebrow="Onboarding do vencedor"
      title="Criar conta de vencedor"
      subtitle="Complete o cadastro do perfil. Informe o hackathon, a categoria e o premio que deseja antecipar. A wallet pode ser conectada depois."
      highlights={[
        {
          title: "Hackathon e premio",
          text: "Identifique o evento e a faixa do premio que sera validado.",
        },
        {
          title: "Projeto participante",
          text: "Adicione um link para demo, repositório ou pitch deck.",
        },
        {
          title: "Liquidacao futura",
          text: "O perfil prepara a analise para antecipacao, emissao do certificado e novas antecipacoes futuras.",
        },
      ]}
    >
      <AuthForm
        role="vencedor"
        fields={fields}
        cta="Criar conta"
        helper="Usaremos esses dados para validar seu premio atual e liberar novas antecipacoes sempre que voce voltar a vencer."
      />
    </AuthLayout>
  );
}
