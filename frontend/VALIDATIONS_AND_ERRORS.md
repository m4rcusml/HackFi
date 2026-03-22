# Validações e Tratamento de Erros

## Resumo

Todas as validações de formulário e tratamento de erros foram implementadas com mensagens em português e formatação adequada para a blockchain.

## Campos do Formulário (Winner Page)

### 1. **Hackathon** (text)
- Validação: Campo obrigatório
- Erro: "Por favor, informe o nome do hackathon."

### 2. **Símbolo do Recibo** (text)
- Validação: Campo obrigatório
- Placeholder: "Ex: MHACK, ETH2024"
- Erro: "Por favor, informe o símbolo do recibo."

### 3. **Proof Seed** (text)
- Formato: String que será convertida em hash via `ethers.id()`
- Placeholder: "Hash ou identificador da prova"

### 4. **Valor do Prêmio** (number)
- Validação: Deve ser > 0
- Formato: Convertido para unidades do token usando `ethers.parseUnits()`
- Placeholder: "1000"
- Helper: "Valor em tokens (hfUSD)"
- Erro: "O valor do prêmio deve ser maior que zero."

### 5. **Desconto (BPS)** (number)
- Validação: Entre 0 e 10000 (0% a 100%)
- Formato: Enviado como BigInt direto para o contrato
- Placeholder: "1000 = 10%"
- Helper: "1000 BPS = 10%, 500 BPS = 5%"
- Erro: "O desconto deve estar entre 0 e 10000 BPS (0% a 100%)."
- Exemplo:
  - 1000 BPS = 10%
  - 500 BPS = 5%
  - 2500 BPS = 25%

### 6. **Data de Pagamento Esperada** (date)
- Tipo: Input type="date" (formato YYYY-MM-DD)
- Validação: Deve ser data futura
- Formato na Blockchain: Timestamp Unix em segundos
- Helper: "Quando você espera receber o prêmio"
- Min: Data de hoje (não aceita datas passadas)
- Conversão: `Math.floor(new Date(dateString).getTime() / 1000)`
- Erro: "A data de pagamento esperada deve ser no futuro."

## Conversões de Formato

### Data → Timestamp
```typescript
// Input do usuário: "2024-12-31" (YYYY-MM-DD)
// Enviado para blockchain: 1735603200 (timestamp Unix em segundos)

const dateToTimestamp = (dateString: string): number => {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
}
```

### Timestamp → Data
```typescript
// Lido da blockchain: 1735603200
// Exibido para usuário: "31/12/2024"

const timestampToDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0];
}
```

## Mensagens de Erro da Blockchain (PT-BR)

### Erros de Usuário
- `user rejected` / `user denied` → "Transação rejeitada pelo usuário."

### Erros de Saldo
- `insufficient funds` / `insufficient balance` → "Saldo insuficiente para pagar o gas da transação."

### Erros de Nonce
- `nonce` → "Erro de nonce. Tente redefinir sua wallet ou aguarde um momento."

### Erros de Gas
- `gas required exceeds` / `intrinsic gas too low` → "Gas insuficiente. A transação requer mais gas do que o disponível."
- `gas` → "Erro ao estimar gas. Verifique sua conexão com a rede."

### Erros de Rede
- `network` / `timeout` / `connection` → "Erro de conexão com a rede. Verifique sua internet e tente novamente."
- `chain mismatch` / `wrong network` → "Rede incorreta. Troque para a Monad Testnet (Chain ID: 10143)."

### Erros de Contrato
- `execution reverted` → "Transação revertida pelo contrato. Verifique os parâmetros."
- `invalid argument` / `invalid parameter` → "Parâmetros inválidos. Verifique os valores informados."

### Erros de Wallet
- `wallet nao conectada` → "Wallet não conectada ou rede incorreta. Conecte na Monad Testnet."

## Funções Utilitárias

Arquivo: `src/lib/error-messages.ts`

### `parseBlockchainError(error: unknown): string`
Converte erros técnicos da blockchain para mensagens amigáveis em português.

### `validateOfferForm(form): { valid: boolean; error?: string }`
Valida todos os campos do formulário de criação de oferta.

### `dateToTimestamp(dateString: string): number`
Converte data YYYY-MM-DD para timestamp Unix (segundos).

### `timestampToDate(timestamp: number): string`
Converte timestamp Unix para formato YYYY-MM-DD.

### `formatDate(dateString: string): string`
Formata data para exibição em português (DD/MM/YYYY).

## Exemplos de Uso

### Criar Oferta Completa
```typescript
const form = {
  hackathonName: "Monad Hackathon 2024",
  symbol: "MHACK",
  proofSeed: "proof-winner-123",
  prizeAmount: "5000",           // 5000 tokens
  discountBps: "1500",           // 15% de desconto
  expectedPaymentDate: "2024-12-31" // 31 de dezembro de 2024
};

// Será convertido para:
{
  hackathonName: "Monad Hackathon 2024",
  symbol: "MHACK",
  proofSeed: ethers.id("proof-winner-123"),
  prizeAmount: ethers.parseUnits("5000", 18),
  discountBps: BigInt(1500),
  expectedPaymentDate: BigInt(1735603200) // timestamp Unix
}
```

## Componente Field

Componente reutilizável que aceita:
- `label`: Texto do label
- `value`: Valor atual
- `onChange`: Callback de mudança
- `type`: "text" | "number" | "date" (padrão: "text")
- `placeholder`: Texto placeholder (opcional)
- `helper`: Texto de ajuda abaixo do campo (opcional)

### Características
- Inputs de data com `min` definido como data atual
- Inputs de número com `step="any"` para aceitar decimais
- Estilo dark mode com `[color-scheme:dark]`
- Helper text em cinza pequeno

## Melhorias Futuras Sugeridas

1. Adicionar tooltips explicativos
2. Validação em tempo real conforme o usuário digita
3. Preview da data convertida para timestamp
4. Calculadora de BPS (input de porcentagem que converte para BPS)
5. Confirmação visual antes de enviar transação
