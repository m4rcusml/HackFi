# Testes UI HackFi

## Setup

- frontend: `C:\Users\Inteli\Documents\GitHub\blockchain\monad\HackFi\frontend`
- subir com:
```bash
cd C:\Users\Inteli\Documents\GitHub\blockchain\monad\HackFi\frontend
npm run dev
```
- URL: `http://localhost:3000`
- rede: `Monad Testnet`

## Contas

Criar 3 contas:
- vencedor: `winner@test.com` / `123456`
- investidor: `investor@test.com` / `123456`
- admin: `admin@test.com` / `123456`

## Checklist global

1. `/` mostra landing publica
2. `/cadastro` mostra 3 perfis
3. `/login` aponta cadastro para `/cadastro`
4. header atualiza com sessao e wallet
5. refresh preserva wallet conectada

## Fluxo vencedor

1. Criar conta em `/cadastro/vencedor`
2. Esperado:
- redireciona para `/winner`
- landing some
- header/sidebar de vencedor
3. Conectar wallet
4. Criar antecipacao com:
- Hackathon `Monad Hackathon`
- Simbolo `MHACK`
- Proof `proof-winner-ui`
- Premio `1000`
- Desconto `1000`
5. Esperado:
- feedback de transacao
- oferta aparece na lista
- sem erro fatal no console

## Fluxo investidor

1. Logout
2. Criar conta em `/cadastro/investidor`
3. Esperado:
- redireciona para `/investor`
- header de investidor
4. Conectar wallet
5. Verificar `/investor` e `/marketplace`
6. Mintar `1000 hfUSD`
7. Aprovar compra
8. Comprar recibos
9. Esperado:
- quote aparece
- approve e buy funcionam
- sem erro fatal de `quote`, `offersCount`, `receiptToken` ou `balanceOf`

## Fluxo admin

1. Logout
2. Criar conta em `/cadastro/admin`
3. Esperado:
- redireciona para `/admin`
- header de admin
4. Conectar wallet
5. Selecionar offer
6. Tentar:
- ativar
- rejeitar
- aprovar settle
- liquidar
7. Esperado:
- se wallet nao for owner: erro legivel sem quebrar UI
- se wallet for owner: operacoes seguem

## Protecao de rotas

1. Sem sessao:
- `/winner`, `/investor`, `/admin` -> `/login`
2. Vencedor em `/admin` -> `/winner`
3. Investidor em `/winner` -> `/investor`
4. Admin em `/investor` -> `/admin`

## Logout

1. Clicar `Sair`
2. Esperado:
- redireciona para `/`
- sessao limpa
- wallet pode continuar conectada, isso e esperado

## Responsividade

Testar desktop, tablet e mobile em:
- `/marketplace`
- `/investor`
- `/winner`
- `/admin`

Verificar:
- sem overflow horizontal
- sem inputs quebrados
- cards e CTAs legiveis

## Relatorio esperado

O agente deve devolver:
- cenarios aprovados
- cenarios com falha
- logs de console relevantes
- bugs de UX por persona
- bugs visuais
