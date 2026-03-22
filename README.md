# HackFi

HackFi é uma plataforma de antecipação de premiação para hackathons construída na Monad. O prêmio futuro vira um recebível fracionado onchain: o vencedor recebe liquidez antes do pagamento oficial e o investidor financia esse valor com desconto.

## Membros

- João Rubens Belluzo Neto
- Marcus Felipe dos Santos Valente
- Nicole Riedla Paiva Neves

## Problema

Prêmios de hackathons podem demorar semanas ou meses para serem pagos. Isso cria um intervalo entre ganhar e realmente receber.

## Solução

1. o vencedor cria uma oferta com nome do hackathon, valor do prêmio, desconto e data prevista;
2. investidores compram frações desse prêmio por meio de recibos onchain;
3. o contrato libera micropagamentos ao vencedor em tranches de 5% conforme o funding avança;
4. quando o valor final do prêmio é depositado, os investidores fazem `claim` do retorno proporcional.

## Personas

### Vencedor

- cria a antecipação;
- acompanha o valor captado;
- recebe liquidez progressiva na wallet.

### Investidor

- analisa oportunidades;
- compra frações do prêmio com desconto;
- acompanha os recibos e faz `claim` após a liquidação.

## Por que Monad

HackFi depende de leituras frequentes, compras fracionadas e micropagamentos. A Monad é adequada para esse fluxo por combinar compatibilidade EVM com baixo custo operacional.

## Arquitetura

### Contratos

- [PrizeFactory.sol](C:\Users\Inteli\Documents\GitHub\blockchain\monad\HackFi\contracts\src\PrizeFactory.sol)
- [PrizeOffer.sol](C:\Users\Inteli\Documents\GitHub\blockchain\monad\HackFi\contracts\src\PrizeOffer.sol)
- [Token.sol](C:\Users\Inteli\Documents\GitHub\blockchain\monad\HackFi\contracts\src\Token.sol)
- [TestERC20.sol](C:\Users\Inteli\Documents\GitHub\blockchain\monad\HackFi\contracts\src\TestERC20.sol)

Responsabilidades:

- `PrizeFactory`: cria ofertas, registra o histórico do vencedor e encaminha a liquidação;
- `PrizeOffer`: representa um prêmio específico e controla funding, tranches e `claim`;
- `Token`: recibo fracionado da oferta;
- `TestERC20`: token de pagamento de teste (`hfUSD`).

### Frontend

- [frontend](C:\Users\Inteli\Documents\GitHub\blockchain\monad\HackFi\frontend)

O frontend atual já possui onboarding por perfil, proteção de rotas, persistência de sessão, persistência da wallet conectada e leitura onchain das ofertas.

## Fluxo onchain atual

- A offer nasce ativa no momento da criação.
- Não existe etapa de aprovação administrativa.
- O desconto aceito onchain vai de `5%` a `15%`.
- O investidor compra recibos proporcionais ao prêmio.
- O vencedor recebe o valor captado em tranches automáticas de `5%`.
- Qualquer pagador pode liquidar a oferta depositando o valor final via factory.

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

### Contratos

```bash
cd contracts
npm install
npx hardhat build
```

### Deploy na testnet

No diretório `contracts`, crie um `.env` com:

```env
PRIVATE_KEY=0xSUA_CHAVE_PRIVADA
PAYMENT_TOKEN_ADDRESS=0xENDERECO_DO_ERC20
```

Depois execute:

```bash
npm run deploy:test-token
npm run deploy:testnet
```

## Fluxo de demo

1. abrir `/cadastro`;
2. escolher o perfil;
3. criar a conta;
4. conectar a wallet na Monad Testnet;
5. testar:
   - vencedor: criar antecipação;
   - investidor: mintar `hfUSD`, aprovar e comprar;
   - qualquer pagador: liquidar a oferta;
   - investidor: executar `claim`.

## MVP

Já funciona:

- criação de conta por perfil;
- criação de ofertas;
- leitura das offers da testnet;
- fluxo de `approve`, `buy`, `claim` e `settle`;
- micropagamentos automáticos para o vencedor.

Limitações atuais:

- autenticação local ao navegador;
- `TestERC20` usado para demonstração;
- anexos e comprovantes ainda fora de um backend real.
