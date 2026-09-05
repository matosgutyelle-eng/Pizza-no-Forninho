# Publicar sem pagar domínio/hospedagem no começo

## Opção recomendada: Cloudflare

A Cloudflare oferece Pages/Workers com plano gratuito. Para este projeto, use Cloudflare Workers/Pages + D1.

### 1. Criar conta
Crie uma conta gratuita na Cloudflare.

### 2. Criar o banco D1
No painel Cloudflare, Workers & Pages → D1 → Create database.
Nome sugerido: `pizza-no-forninho`.

Depois execute o conteúdo de `migrations/0001_init.sql` no console SQL do banco.

### 3. Publicar os arquivos
Suba esta pasta para um repositório GitHub privado ou público e conecte o repositório ao Cloudflare Pages/Workers.

Se preferir usar o terminal, instale Wrangler e rode `wrangler login` e depois configure o `database_id` do D1 em `wrangler.toml`.

### 4. Secrets
No projeto, configure:

- `ADMIN_PASSWORD` — sua senha do painel
- `SESSION_SECRET` — uma frase longa aleatória
- `MP_ACCESS_TOKEN` — Access Token de produção do Mercado Pago
- `ORS_API_KEY` — chave Standard do OpenRouteService
- `STORE_LAT` e `STORE_LON` — coordenadas da loja
- `PUBLIC_BASE_URL` — endereço final do site, por exemplo `https://pizza-no-forninho.pages.dev`

Nunca coloque esses valores no código público.

### 5. Domínio
Você não precisa comprar domínio para começar. O Pages fornece um endereço `pages.dev` para o projeto. Depois, se quiser um endereço profissional como `pizzanoforninho.com.br`, você pode comprar o domínio quando quiser.

### 6. Mercado Pago
No Mercado Pago, crie uma aplicação e use o Access Token no secret `MP_ACCESS_TOKEN`. O site cria a preferência no backend e usa o Checkout Pro; o webhook atualiza o pedido depois do pagamento.

### 7. OpenRouteService
Crie uma chave Standard gratuita. O projeto usa geocodificação + rota de carro. Para esta pizzaria, a faixa de até 1,7 km deixa a área bem pequena.

### 8. Coordenadas da loja
No mapa, obtenha a latitude e longitude exatas da Rua B, Conjunto Lagoa Azul - Centro, Candeal - BA e coloque em `STORE_LAT` e `STORE_LON`.

## Observação sobre “grátis”
O site/hospedagem/banco podem começar em planos gratuitos. O Mercado Pago não é “grátis” por transação: as vendas podem ter as taxas aplicáveis do próprio Mercado Pago. Domínio próprio também é opcional e normalmente pago.
