import { AuthForm, AuthLayout } from "@/components/auth";

const fields = [
  { name: "fullName", label: "Nome completo", placeholder: "Responsavel pela organizacao", full: true },
  { name: "email", label: "Email corporativo", placeholder: "ops@hackathon.io", type: "email" as const },
  { name: "organization", label: "Organizacao", placeholder: "Nome do protocolo ou hackathon" },
  { name: "roleTitle", label: "Cargo", placeholder: "Community lead, ops, organizer..." },
  { name: "prizeVolume", label: "Volume total de premios", placeholder: "Ex.: 250000", type: "number" as const },
  { name: "eventLink", label: "Link do evento", placeholder: "Site ou pagina oficial", full: true },
  { name: "password", label: "Senha", placeholder: "Crie uma senha segura", type: "password" as const, full: true },
];

export default function CadastroAdminPage() {
  return (
    <AuthLayout
      eyebrow="Onboarding do administrador"
      title="Criar conta de administrador"
      subtitle="Cadastre a organizacao para validar vencedores, acompanhar o escrow e operar a emissao de certificados na plataforma."
      highlights={[
        {
          title: "Organizacao do evento",
          text: "Identifique quem opera o hackathon, bounty ou programa de premios.",
        },
        {
          title: "Volume de premios",
          text: "Ajuda a preparar regras de liberacao, validacao e onboarding.",
        },
        {
          title: "Fluxo operacional",
          text: "Depois do cadastro voce podera emitir certificados e confirmar pagamentos.",
        },
      ]}
    >
      <AuthForm
        role="admin"
        fields={fields}
        cta="Criar conta"
        helper="Depois do cadastro voce podera conectar a wallet institucional e configurar os fluxos de premios."
      />
    </AuthLayout>
  );
}
