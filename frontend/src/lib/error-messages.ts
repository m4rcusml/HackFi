/**
 * Converte erros da blockchain para mensagens em português mais amigáveis
 */
export function parseBlockchainError(error: unknown): string {
  if (!(error instanceof Error)) {
    return "Erro desconhecido ao processar a transação.";
  }

  const msg = error.message.toLowerCase();

  // Erros de usuário
  if (msg.includes("user rejected") || msg.includes("user denied")) {
    return "Transação rejeitada pelo usuário.";
  }

  // Erros de saldo
  if (msg.includes("insufficient funds") || msg.includes("insufficient balance")) {
    return "Saldo insuficiente para pagar o gas da transação.";
  }

  // Erros de nonce
  if (msg.includes("nonce")) {
    return "Erro de nonce. Tente redefinir sua wallet ou aguarde um momento.";
  }

  // Erros de gas
  if (msg.includes("gas required exceeds allowance") || msg.includes("intrinsic gas too low")) {
    return "Gas insuficiente. A transação requer mais gas do que o disponível.";
  }

  if (msg.includes("gas")) {
    return "Erro ao estimar gas. Verifique sua conexão com a rede.";
  }

  // Erros de rede
  if (msg.includes("network") || msg.includes("timeout") || msg.includes("connection")) {
    return "Erro de conexão com a rede. Verifique sua internet e tente novamente.";
  }

  // Erros de wallet
  if (msg.includes("wallet nao conectada") || msg.includes("conecte na monad")) {
    return "Wallet não conectada ou rede incorreta. Conecte na Monad Testnet.";
  }

  if (msg.includes("chain mismatch") || msg.includes("wrong network")) {
    return "Rede incorreta. Troque para a Monad Testnet (Chain ID: 10143).";
  }

  // Erros de contrato
  if (msg.includes("execution reverted")) {
    // Tentar extrair a razão do revert
    const revertMatch = error.message.match(/reverted with reason string '([^']+)'/);
    if (revertMatch) {
      return `Transação revertida: ${revertMatch[1]}`;
    }
    return "Transação revertida pelo contrato. Verifique os parâmetros.";
  }

  if (msg.includes("invalid argument") || msg.includes("invalid parameter")) {
    return "Parâmetros inválidos. Verifique os valores informados.";
  }

  // Retornar mensagem original se não identificado
  return error.message;
}

/**
 * Valida campos de formulário comuns
 */
export function validateOfferForm(form: {
  hackathonName: string;
  symbol: string;
  prizeAmount: string;
  discountBps: string;
  expectedPaymentDate: string;
}): { valid: boolean; error?: string } {
  if (!form.hackathonName.trim()) {
    return { valid: false, error: "Por favor, informe o nome do hackathon." };
  }

  if (!form.symbol.trim()) {
    return { valid: false, error: "Por favor, informe o símbolo do recibo." };
  }

  if (!form.prizeAmount || Number(form.prizeAmount) <= 0) {
    return { valid: false, error: "O valor do prêmio deve ser maior que zero." };
  }

  const discount = Number(form.discountBps);
  if (isNaN(discount) || discount < 0 || discount > 10000) {
    return { valid: false, error: "O desconto deve estar entre 0 e 10000 BPS (0% a 100%)." };
  }

  if (!form.expectedPaymentDate) {
    return { valid: false, error: "Por favor, selecione a data esperada de pagamento." };
  }

  // Validar se a data é futura
  const selectedDate = new Date(form.expectedPaymentDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    return { valid: false, error: "A data de pagamento esperada deve ser no futuro." };
  }

  return { valid: true };
}

/**
 * Converte data no formato YYYY-MM-DD para timestamp Unix (segundos)
 */
export function dateToTimestamp(dateString: string): number {
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
}

/**
 * Converte timestamp Unix (segundos) para formato YYYY-MM-DD
 */
export function timestampToDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toISOString().split('T')[0];
}

/**
 * Formata a data para exibição amigável
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
