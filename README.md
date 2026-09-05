# Pizza no Forninho — projeto corrigido

Estrutura correta para Cloudflare Pages + Pages Functions:

- `index.html`
- `admin.html`
- `assets/logo.png`
- `functions/api/*.js`
- `migrations/0001_init.sql`

A página pública inclui uma proteção de carregamento: enquanto o D1 ainda não estiver configurado, ela consegue mostrar a logo e o cardápio inicial. Os pedidos reais continuam dependendo da configuração do D1, da chave de roteamento e do Mercado Pago.

Não coloque senhas, tokens ou chaves secretas no GitHub.
