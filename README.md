# HackFi

HackFi é uma plataforma de antecipação de prêmios para hackathons.

A proposta é simples: vencedores não deveriam esperar semanas ou meses para receber um prêmio já conquistado. No HackFi, esse prêmio futuro vira um recebível fracionado onchain. O vencedor recebe liquidez antes, investidores compram frações com desconto, e o organizador valida e liquida o pagamento final.

## Membros

Preencher com os nomes da equipe:
- João Rubens Belluzo Neto
- Marcus Felipe dos Santos Valente
- Nicole Riedla Paiva Neves

## Problema

Prêmios de hackathons frequentemente atrasam por burocracia operacional, revisão manual e fluxo de tesouraria. Isso cria um vazio entre:
- quem já ganhou
- quem ainda não recebeu
- quem poderia financiar esse valor antecipadamente

## Solução

HackFi cria uma infraestrutura onchain para antecipação de recebíveis:

1. o vencedor registra o prêmio e cria uma antecipação
2. o admin valida a prova do hackathon
3. investidores compram frações do prêmio
4. o contrato libera capital ao vencedor em tranches
5. quando o prêmio real chega, o admin liquida a oferta
6. investidores fazem `claim` do retorno proporcional

## Personas

### Vencedor
- registra o prêmio
- cria a antecipação
- acompanha funding e valor liberado

### Investidor
- visualiza ofertas
- aprova `hfUSD`
- compra recibos fracionados
- acompanha saldo, quote e claim

### Admin
- valida ofertas
- ativa ou rejeita oportunidades
- aprova o settle
- liquida o prêmio final

## Por que Monad

HackFi combina com a Monad porque o produto depende de:
- muitas leituras de estado
- interações frequentes no frontend
- pagamentos fracionados
- boa UX para transações pequenas

## Arquitetura

### Smart contracts

Arquivos principais:
- [PrizeFactory.sol](contracts\src\PrizeFactory.sol)
- [PrizeOffer.sol](contracts\src\PrizeOffer.sol)
- [Token.sol](contracts\src\Token.sol)
- [TestERC20.sol](contracts\src\TestERC20.sol)

Responsabilidades:
- `PrizeFactory`: cria, registra, ativa, rejeita e liquida ofertas
- `PrizeOffer`: representa um prêmio específico e controla funding, tranches e claim
- `Token`: recibo fracionado da oferta
- `TestERC20`: token de pagamento de teste (`hfUSD`)

### Frontend

Local:
- [frontend](frontend)

Stack:
- Next.js
- React
- Tailwind CSS
- ethers v6

O frontend já possui:
- onboarding por perfil
- proteção de rotas
- persistência de sessão
- persistência da wallet conectada
- dashboards separados para vencedor, investidor e admin
- marketplace com leitura onchain

## Deploy atual na Monad Testnet

- `PrizeFactory`: `0x9b293Eaf3441DA20f9D113E20A7593407c31700C`
- `hfUSD / TestERC20`: `0x0849c76D22704C4427aC155712d0b3A911a230fb`
- Chain ID: `10143`

## Como executar

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Aplicação local:
- `http://localhost:3000`

### Contratos

```bash
cd contracts
npm install
npm run build
```

### Deploy na testnet

No diretório `contracts`, criar `.env` com:

```env
PRIVATE_KEY=0xSUA_CHAVE_PRIVADA
PAYMENT_TOKEN_ADDRESS=0xENDERECO_DO_ERC20
```

Depois:

```bash
npm run deploy:test-token
npm run deploy:testnet
```

## Fluxo de demo

1. abrir `/cadastro`
2. escolher o perfil
3. criar a conta
4. conectar a wallet na Monad testnet
5. testar:
   - vencedor: criar antecipação
   - investidor: mintar `hfUSD`, aprovar e comprar
   - admin: ativar, rejeitar ou liquidar

## O que já funciona no MVP

- criação de conta por perfil
- proteção de rotas por role
- logout do app
- criação de ofertas
- leitura das offers da testnet
- fluxo de `approve`, `buy`, `claim`, `activate`, `reject` e `settle` na interface

## Limitações atuais

- autenticação ainda é local ao navegador
- anexos e comprovantes ainda não estão integrados a um backend real
- `TestERC20` é usado para demonstração
- o fluxo completo depende de MetaMask e wallet com permissão correta

## Próximos passos

- integrar backend real para provas e links
- substituir autenticação local por auth persistente
- suportar token de pagamento real na rede
- melhorar analytics e histórico de operações
