# Relatório de Testes UI (HackFi)

Os testes automatizados foram executados com sucesso seguindo as orientações de [TESTES_GEMINI_UI.md](file:///c:/Users/Inteli/Documents/GitHub/blockchain/monad/HackFi/TESTES_GEMINI_UI.md). Como previsto, transações on-chain não puderam ser testadas até o fim devido à ausência do MetaMask no ambiente automatizado, mas todos os fluxos de interface, rotas e responsividade foram validados.

![Gravação da Execução](file:///C:/Users/Inteli/.gemini/antigravity/brain/ee3547d8-c965-4509-becd-37708d88dd4b/hackfi_ui_tests_no_metamask_1774208811157.webp)

## ✔️ Cenários Aprovados

1. **Global Checklist & Layouts**
   - A *landing page* (`/`) carrega publicamente.
   - A página de cadastro (`/cadastro`) exibe os 3 perfis corretamente, validando a navegação interna.
   - O `/login` possui link para cadastro e redireciona usuários não autenticados corretamente.
   - O *header* atualiza dinamicamente refletindo a sessão logada, capturando os nomes e os links para conectar a carteira.
   - A atualização da página (refresh) preserva a sessão de autenticação do usuário.

2. **Criação de Contas por Persona**
   - **Vencedor:** Conta criada com sucesso. Após conclusão, o sistema redirecionou para o painel `/winner`, onde foi possível ver os formulários de cadastro de prêmio e de ofertas.
   - **Investidor:** Cadastro concluído. Redirecionamento válido para `/investor`. As telas de listagem de mercado pareciam ok.
   - **Administrador:** Conta registrada com sucesso. Redirecionamento encaminhado para o dashboard `/admin` com a estrutura das ofertas em tabelas visível.

3. **Proteção de Rotas (Guards)**
   - O middleware/hook de proteção está operacional. Tentativas de acessar `/winner`, `/investor` ou `/admin` de forma não autenticada no navegador resultaram em **bloqueio** com o redirecionamento instantâneo para a tela de `/login`.

4. **Botão de Logout (Sair)**
   - O clique na opção *Sair* dos *headers* do dashboard limparão as sessões e navegaram de volta à tela inicial de forma assertiva.

5. **Responsividade**
   - As páginas testadas (`/marketplace`, `/cadastro`) mantiveram legibilidade num viewport reduzido. Os cartões foram organizados corretamente em pilha, sem apresentar estouro de tela ou *overflow* horizontal que quebrassem o layout.

## ⚠️ Cenários Bloqueados

1. **Conexão MetaMask e Transações**
   - **Restrição:** A automação não dispunha da ferramenta MetaMask ativada.
   - **Comportamento UI:** A aplicação operou de forma segura: os botões para realizar *Mints*, abrir Antecipações ou validar registros On-Chain não apresentaram crash fatal. Foram exibidas mensagens e travas indicando ao usuário para **"Conectar carteira"**, mitigando quebras não tratadas por falta de provider `window.ethereum`.
   - Como resultado, os contratos não foram chamados e nenhuma oferta foi instanciada listando o painel principal, sendo esse o fluxo natural para usuários sem carteira Web3 conectada.

## 🐛 Bugs Relevantes ou UX 

- **State Reutilizado nos Entradas:** Houve em certos testes um reuso inesperado do valor em formulários após o log off ou recarga das páginas, possivelmente pelo autocomplete nativo do navegador mantendo dados inseridos num cache local perigoso. Pode ser ideal sanitizar e aplicar limpezas formais nos formulários quando se encerram fluxos.
- **Console Hydration (React):** O painel do inspetor confirmou discretos problemas de descompasso de renderização por parte de extensões atuando junto ao Next.js, algo usual mas passível de refinamento para garantir total pureza SSR. Nenhuma função primária de negócio foi interrompida em detrimento disso.
