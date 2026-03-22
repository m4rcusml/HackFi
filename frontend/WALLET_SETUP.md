# Configuração da Wallet com RainbowKit

## Resumo das Mudanças

O sistema de autenticação foi migrado de login/senha mockado para autenticação exclusiva via wallet usando RainbowKit.

## Configuração Necessária

### 1. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=seu_project_id_aqui
```

Para obter um Project ID:
1. Acesse https://cloud.walletconnect.com
2. Crie um projeto
3. Copie o Project ID

### 2. Rede Monad Testnet

A aplicação está configurada para usar a Monad Testnet:
- **Chain ID**: 10143 (0x279f)
- **Nome**: Monad Testnet
- **RPC**: https://testnet-rpc.monad.xyz
- **Explorer**: https://explorer.testnet.monad.xyz

## Como Usar

### Conectar Wallet

1. Clique no botão "Connect Wallet" no canto superior direito
2. Selecione sua wallet preferida (MetaMask, WalletConnect, etc.)
3. Aprove a conexão
4. A rede será automaticamente trocada para Monad Testnet se necessário

### Acessar Painéis

Após conectar a wallet, você pode acessar diretamente:
- `/winner` - Painel do Vencedor
- `/investor` - Painel do Investidor
- `/admin` - Painel do Administrador

Todas as páginas verificam apenas se a wallet está conectada, sem distinção de "roles".

## Mensagens de Erro Comuns

### "Wallet nao conectada ou rede incorreta. Conecte na Monad Testnet"

**Causa**: A wallet não está conectada ou está em uma rede diferente da Monad Testnet.

**Solução**:
1. Conecte sua wallet usando o botão no navbar
2. Certifique-se de que está na rede Monad Testnet (Chain ID: 10143)
3. Se a rede não trocar automaticamente, adicione manualmente:
   - Chain ID: 10143 (0x279f em hexadecimal)
   - RPC URL: https://testnet-rpc.monad.xyz
   - Currency Symbol: MON
   - Block Explorer: https://explorer.testnet.monad.xyz

### "window.ethereum not available"

**Causa**: Nenhuma wallet está instalada no navegador.

**Solução**:
1. Instale MetaMask ou outra wallet compatível
2. Ou use WalletConnect para conectar via QR code

## Estrutura dos Componentes

- **`src/lib/wagmi.ts`**: Configuração do Wagmi e RainbowKit
- **`src/components/providers.tsx`**: Providers do app (Wagmi + RainbowKit)
- **`src/components/auth-guard.tsx`**: Proteção de rotas (verifica conexão da wallet)
- **`src/hooks/use-hackfi.ts`**: Hook principal para interação com contratos

## Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build
```

## Contratos Deployados

- **Factory**: Endereço configurado em `src/lib/contracts.ts`
- **Token**: Endereço configurado em `src/lib/contracts.ts`

Todos os endereços estão configurados para a Monad Testnet.
