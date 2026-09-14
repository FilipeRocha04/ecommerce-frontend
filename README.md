# AutoParts AI Assistant

Crie o FRONTEND completo de um e-commerce moderno de peças automotivas chamado provisoriamente de AutoParts.

O projeto será uma plataforma de venda de peças para carros com DUAS formas principais de compra:

Compra tradicional pelo e-commerce, navegando pelos produtos, categorias, carrinho e checkout.

Compra assistida por um AGENTE DE IA em formato de chat, semelhante a uma conversa no WhatsApp. O cliente poderá explicar o que precisa, informar seu veículo, tirar dúvidas e pedir recomendações de peças.

IMPORTANTE:
Neste momento quero focar principalmente na EXPERIÊNCIA, DESIGN e FRONTEND. Utilize dados mockados para produtos, veículos, pedidos, estoque, avaliações e conversas.

==================================================
IDENTIDADE VISUAL

Quero uma interface moderna, premium e minimalista inspirada em grandes e-commerces automotivos.

Paleta principal:

preto/grafite

branco

cinza claro

vermelho como cor de destaque

Evite excesso de vermelho. Utilize principalmente para:

CTAs

preços promocionais

indicadores importantes

pequenos detalhes da identidade

Características:

visual profissional

bastante espaço em branco

cards modernos

bordas discretas

sombras sutis

ícones minimalistas

excelente hierarquia visual

tipografia moderna e legível

totalmente responsivo

mobile first

NÃO quero:

aparência genérica de template

gradientes exagerados

elementos neon

excesso de animações

interface com "cara de IA"

excesso de cards coloridos

O site deve transmitir:

CONFIANÇA + TECNOLOGIA + AUTOMOTIVO + SEGURANÇA.

==================================================
HEADER

Criar um header contendo:

Logo AutoParts

Barra de pesquisa grande:

"Busque por peça, código ou modelo do carro..."

Links/categorias:

Motor

Freios

Suspensão

Elétrica

Filtros

Óleos e Fluidos

Acessórios

Ofertas

Adicionar também:

Minha conta

Meus pedidos

Carrinho

No mobile utilizar menu hamburguer e manter pesquisa facilmente acessível.

==================================================
SELETOR DE VEÍCULO

Esse elemento é MUITO IMPORTANTE.

Permitir que o usuário selecione seu carro:

Marca
Modelo
Ano
Motorização

Exemplo:

Volkswagen
Gol
2020
1.6 MSI

Depois mostrar:

"Seu veículo"

Volkswagen Gol 1.6 MSI 2020

[ Trocar veículo ]

Quando houver um veículo selecionado, destacar nos produtos:

✓ Compatível com seu veículo

ou

⚠ Verificar compatibilidade

O veículo selecionado deve permanecer visível durante a experiência de compra.

==================================================
HOME

Criar uma Home moderna.

Hero principal:

"Encontre a peça certa para o seu carro."

Subtítulo:

"Peças automotivas das melhores marcas, com compatibilidade verificada para o seu veículo."

CTAs:

[ Buscar peças para meu carro ]

[ Comprar com o assistente ]

Adicionar imagem elegante de um carro moderno no hero.

Logo abaixo mostrar benefícios:

Entrega rápida
Pagamento seguro
Peças de qualidade
Compra segura
Suporte especializado

==================================================
BUSCA POR CATEGORIA

Criar seção:

"Busque por categoria"

Categorias:

Freios
Suspensão
Motor
Filtros
Elétrica
Óleos e Fluidos
Iluminação
Acessórios

Usar imagens reais ou placeholders de peças automotivas.

==================================================
PRODUTOS EM DESTAQUE

Criar cards contendo:

Imagem
Marca
Nome
Compatibilidade
Avaliação
Quantidade de avaliações
Preço
Parcelamento
Status de estoque

Exemplo:

BOSCH

Pastilha de Freio Dianteira Bosch

✓ Compatível com Gol 1.6 2020

★★★★★ 4.8 (324)

R$ 189,90

6x de R$ 31,65

● Em estoque

[ Adicionar ao carrinho ]

Adicionar botão de favorito.

==================================================
CATÁLOGO / LISTAGEM

Criar página de produtos.

Sidebar desktop com filtros:

Categoria
Marca
Veículo
Faixa de preço
Avaliação
Disponibilidade

No mobile abrir filtros através de bottom sheet ou drawer.

Mostrar no topo:

"32 produtos encontrados"

Ordenação:

Mais relevantes
Menor preço
Maior preço
Melhor avaliação

Grid responsivo de produtos.

==================================================
PÁGINA DO PRODUTO

Criar página detalhada.

Galeria de imagens à esquerda.

Informações à direita:

Marca
Nome
Avaliações
Preço
Parcelamento
Estoque
Quantidade

Botões:

[ Adicionar ao carrinho ]

[ Comprar com o assistente ]

Criar seção muito importante:

COMPATIBILIDADE

✓ Esta peça é compatível com:

Volkswagen Gol 1.6 MSI 2020

[ Alterar veículo ]

Adicionar:

Descrição
Especificações técnicas
Aplicações
Marca
Código da peça
Garantia
Avaliações

Criar também:

"Você também pode precisar"

com produtos complementares.

==================================================
CARRINHO

Página:

"Meu carrinho"

Mostrar:

Imagem
Produto
Compatibilidade
Quantidade
Preço
Remover

Resumo:

Subtotal
Frete
Desconto
Total

Campo:

"Cupom de desconto"

Botões:

[ Finalizar compra ]

[ Continuar comprando ]

Adicionar recomendações:

"Você também pode precisar"

Exemplo:

Filtro de óleo
Filtro de ar
Velas
Fluido de freio

==================================================
CHECKOUT

Criar checkout dividido em etapas:

1 Entrega
2 Pagamento
3 Revisão

ENTREGA:

Nome
CPF
CEP
Rua
Número
Complemento
Cidade
Estado

PAGAMENTO:

PIX
Cartão
Boleto

REVISÃO:

Produtos
Entrega
Pagamento
Subtotal
Frete
Desconto
Total

CTA:

[ Confirmar pedido ]

==================================================
PEDIDO CONFIRMADO

Criar página:

✓ Pedido confirmado!

"Seu pedido está sendo preparado."

Número:

#AP874321

Mostrar:

Previsão de entrega
Forma de pagamento
Endereço
Produtos

Botões:

[ Acompanhar pedido ]

[ Continuar comprando ]

==================================================
MINHA CONTA

Criar área do cliente.

Sidebar:

Visão geral
Meus pedidos
Meus veículos
Favoritos
Endereços
Dados pessoais

==================================================
MEUS VEÍCULOS

Permitir cadastrar vários veículos.

Exemplo:

Volkswagen Gol
1.6 MSI
2020

[ Veículo principal ]

Adicionar:

[ + Adicionar veículo ]

==================================================
MEUS PEDIDOS

Listagem contendo:

Número
Data
Produtos
Valor
Status

Status possíveis:

Pagamento aprovado
Separando pedido
Enviado
Saiu para entrega
Entregue

Criar timeline visual para acompanhamento.

==================================================
ASSISTENTE DE COMPRAS

Esta é uma das funcionalidades MAIS IMPORTANTES.

Criar uma experiência de chat inspirada no WhatsApp, mas integrada visualmente à identidade do e-commerce.

O usuário poderá iniciar pelo botão:

"Comprar com o assistente"

Criar uma página dedicada:

/assistente

Header:

Assistente AutoParts
● Online

Mensagem inicial:

"Olá! 👋 Sou seu assistente de compras.

Posso ajudar você a encontrar a peça certa para o seu carro.

O que você está procurando?"

Exemplo:

CLIENTE:
"Preciso de pastilhas de freio para um Gol 1.6 2020."

ASSISTENTE:
"Encontrei algumas opções compatíveis com seu Gol 1.6 2020."

Mostrar CARDS DE PRODUTO DENTRO DA CONVERSA.

Card:

Imagem

Pastilha de Freio Bosch
R$ 189,90

✓ Compatível

[ Ver detalhes ]
[ Adicionar ao carrinho ]

Outro exemplo:

CLIENTE:
"Qual você recomenda?"

ASSISTENTE:
"A Bosch possui ótima durabilidade e é uma boa escolha para uso diário. A TRW também é uma excelente alternativa e custa um pouco menos."

O usuário pode então dizer:

"Pode colocar a Bosch no carrinho."

ASSISTENTE:

"Adicionado! 🛒

Pastilha de Freio Bosch
Quantidade: 1
R$ 189,90"

Botões:

[ Ver carrinho ]

[ Continuar comprando ]

==================================================
CHAT + CARRINHO

No desktop, considere uma experiência onde o chat ocupa aproximadamente 65-70% da tela e um painel lateral mostra:

MEU CARRINHO

Produtos adicionados
Subtotal
Frete
Total

No mobile, o carrinho pode ser acessado por um botão fixo.

Isso deve permitir que o usuário faça praticamente toda a compra sem sair da conversa.

==================================================
BUSCA INTELIGENTE

Criar experiência visual para pesquisas naturais.

Exemplos:

"pastilha de freio gol 2020"

"óleo para civic 2018"

"preciso trocar os filtros do meu carro"

"meu carro está fazendo barulho quando freio"

Para pesquisas mais complexas, sugerir:

"Quer conversar com nosso assistente para encontrar a peça certa?"

[ Falar com o assistente ]

==================================================
RESPONSIVIDADE

Priorizar MOBILE FIRST.

No celular:

navegação inferior opcional

carrinho facilmente acessível

filtros em drawer

cards compactos

chat ocupando toda tela

botões grandes

áreas de toque confortáveis

checkout simples

A experiência deve funcionar muito bem como PWA.

==================================================
DADOS MOCKADOS

Criar pelo menos 20 produtos realistas distribuídos entre:

Freios
Motor
Suspensão
Filtros
Elétrica
Óleos
Iluminação
Acessórios

Utilizar marcas conhecidas como exemplos:

Bosch
TRW
NGK
Mann Filter
Tecfil
Cofap
Monroe
Mobil
Shell
Philips

Criar compatibilidade mockada para veículos populares como:

Volkswagen Gol
Volkswagen Polo
Chevrolet Onix
Chevrolet Corsa
Fiat Uno
Fiat Argo
Fiat Palio
Honda Civic
Toyota Corolla
Hyundai HB20

==================================================
ROTAS

Criar:

/
/produtos
/produto/:id
/carrinho
/checkout
/pedido-confirmado
/assistente
/conta
/conta/pedidos
/conta/veiculos
/conta/favoritos

==================================================
ARQUITETURA DO FRONTEND

Criar componentes reutilizáveis:

Header
Footer
ProductCard
VehicleSelector
CompatibilityBadge
PriceDisplay
CartItem
OrderCard
ChatMessage
ChatProductCard
SearchBar
FilterSidebar

Separar corretamente:

pages
components
hooks
services
types
mocks

Não colocar toda aplicação em um único arquivo.

==================================================
IMPORTANTE PARA O PROJETO FUTURO

Embora neste momento sejam utilizados mocks, prepare a interface pensando que futuramente haverá backend e coleta de eventos.

As principais interações deverão futuramente gerar eventos como:

product_viewed
product_searched
vehicle_selected
product_recommended
product_added_to_cart
product_removed_from_cart
checkout_started
purchase_completed
assistant_started
assistant_message_sent
assistant_product_recommended
assistant_add_to_cart

Também existirão dois canais:

channel = "web"
channel = "assistant"

Portanto, organize o frontend de maneira que futuramente seja simples conectar essas ações a uma API de tracking.

==================================================
OBJETIVO FINAL

Quero que o resultado pareça um PRODUTO REAL de e-commerce automotivo, não apenas um projeto acadêmico.

O principal diferencial deve ficar evidente:

O cliente pode comprar da maneira tradicional OU simplesmente conversar com um assistente inteligente e pedir:

"Preciso trocar as pastilhas de freio do meu Gol 2020."

O sistema encontra produtos compatíveis e permite concluir a compra através da conversa.

Priorize UX, confiança, compatibilidade das peças com o veículo e uma experiência extremamente simples.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/816a9455-f455-40c2-a403-c9d748575df2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Database

The e-commerce catalog, cart, orders and the AI assistant's conversations/tool
calls/event log are backed by PostgreSQL via [Drizzle ORM](https://orm.drizzle.team).
See `src/db/schema/` for the table definitions — every table there mirrors the
relational model described in the project's data design (users, vehicles,
catalog, inventory, cart, orders, payments, and the assistant/analytics
tables: conversations, messages, tool_calls, product_recommendations, events).

### 1. Start Postgres

```sh
docker compose up -d
```

This starts Postgres 16 on `localhost:5432` with the credentials already
wired into `.env.example` (user/password/db: `autoparts`).

### 2. Configure the connection

```sh
cp .env.example .env
```

`DATABASE_URL` in `.env` already matches the `docker-compose.yml` defaults —
edit it only if you're pointing at a different Postgres instance.

### 3. Run migrations

```sh
npm run db:generate   # after changing src/db/schema/*.ts — generates SQL under src/db/migrations
npm run db:migrate     # applies pending migrations to DATABASE_URL
```

The first migration also enables the `pgcrypto` extension (needed for
`gen_random_uuid()` primary keys), so a fresh database needs no manual setup
beyond `db:migrate`.

### 4. Seed development data

```sh
npm run db:seed
```

Inserts vehicle makes/models/variants, part brands, hierarchical categories,
~20 demo products with images/inventory/compatibility, a demo user
(`cliente@autoparts.dev` / `Senha123!`) with an address and two vehicles, a
cart, a completed order with payment, and a sample assistant conversation
(messages, tool calls, a recommendation and matching events). All of this is
mock data for local development — compatibility rows are explicitly annotated
as unverified and must not be treated as a real parts-fitment source.

Other useful scripts: `npm run db:studio` opens [Drizzle
Studio](https://orm.drizzle.team/drizzle-studio/overview) against your local
database; `npm test` runs the constraint tests in `src/db/__tests__/` (they
run against the real `DATABASE_URL`, each inside a transaction that's rolled
back, so they never leave data behind).
