# Pizza no Forninho — site real

Arquitetura preparada para Cloudflare Pages/Workers + D1 + Mercado Pago + OpenRouteService.

## O que funciona no código
- Site público responsivo com identidade azul/dourado e logo real.
- Montador: Pequena aceita 1 sabor; Média/Grande/Família aceitam até 2.
- Preços e bordas por tamanho.
- Bebidas atuais.
- Nome, endereço sem bairro, ponto de referência e observação.
- Entrega por rota real: 0–300m R$2; 301–700m R$3; 701–1000m R$4; acima de 1km R$5.
- Retirada grátis.
- Controle manual ABERTA/FECHADA no painel.
- Cardápio editável no painel, inclusive novos produtos/categorias e status “Em falta”.
- Pedidos persistidos em D1.
- Checkout Mercado Pago (preferência criada no backend; token nunca vai para o navegador).
- Webhook de pagamento.
- Link de WhatsApp para pedido e para desistência/atendimento.
- Login administrativo via senha em variável secreta.

## Importante antes de publicar
1. Crie conta Cloudflare.
2. Crie um projeto Pages/Workers e um banco D1.
3. Execute `migrations/0001_init.sql` no D1.
4. Configure secrets/variáveis: `ADMIN_PASSWORD`, `SESSION_SECRET`, `MP_ACCESS_TOKEN`, `ORS_API_KEY`, `STORE_LAT`, `STORE_LON`, `PUBLIC_BASE_URL`.
5. Publique o projeto.
6. No Mercado Pago, configure a URL de webhook para `https://SEU-ENDERECO/api/mp-webhook`.

### Endereço grátis
Sem comprar domínio, o Cloudflare Pages pode publicar um endereço gratuito do tipo `seuprojeto.pages.dev`. Isso evita pagar domínio no começo. Um domínio `.com.br` próprio é opcional e normalmente pago.

### Pagamento
O Mercado Pago é quem processa o pagamento e cobra as taxas da transação. A hospedagem/banco podem começar no plano gratuito, dentro dos limites dos provedores.

### Distância
Para rota real, o projeto usa OpenRouteService. É necessário criar uma chave Standard gratuita. O projeto calcula por rota de carro e aplica a faixa de entrega definida pela pizzaria.

## Segurança
Nunca coloque `MP_ACCESS_TOKEN`, `ADMIN_PASSWORD` ou `SESSION_SECRET` dentro do JavaScript público. Use os secrets da plataforma.

## Próximo passo
Depois de criar as contas, envie apenas os dados não secretos ou prints das telas de configuração. Não envie senhas, cartão, código 2FA ou token privado em mensagem.
