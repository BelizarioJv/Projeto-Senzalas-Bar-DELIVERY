#  Senzalas Delivery

Sistema de delivery integrado ao **Senzalas Bar ERP**, desenvolvido para permitir que clientes realizem pedidos online enquanto o estabelecimento gerencia os pedidos e utiliza os dados de produtos e estoque já existentes no ERP.

O projeto faz parte do ecossistema **Senzalas**, criado com o objetivo de transformar um sistema de gestão de um negócio real em uma aplicação completa, explorando conceitos de **arquitetura de software, APIs, autenticação, GraphQL, integração entre sistemas e processamento de pedidos**.

> 🚧 **Status:** Em desenvolvimento

---

## 📌 Sobre o projeto

O **Senzalas Delivery** será responsável pela experiência de compra do cliente, enquanto o **Senzalas ERP** continua sendo a fonte principal dos dados relacionados aos produtos e à operação do estabelecimento.

A arquitetura foi pensada para separar as responsabilidades entre os sistemas:

```text
                    ┌─────────────────────┐
                    │    Senzalas ERP     │
                    │                     │
                    │ Produtos            │
                    │ Estoque              │
                    │ Preços              │
                    │ Vendas              │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │  Senzalas Delivery  │
                    │      Backend        │
                    │                     │
                    │ GraphQL API         │
                    │ Autenticação        │
                    │ Pedidos             │
                    │ Clientes            │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Delivery Web     │
                    │                     │
                    │ Catálogo            │
                    │ Carrinho            │
                    │ Checkout            │
                    │ Acompanhamento      │
                    └─────────────────────┘
```

A ideia principal é que o Delivery **não mantenha uma cópia desnecessária dos produtos do ERP**. O backend do Delivery consulta o ERP quando precisa dessas informações.

---

## 🎯 Objetivos

* Criar uma plataforma de pedidos online para o Senzalas.
* Integrar o Delivery ao ERP existente.
* Consumir os produtos do ERP através de uma API.
* Utilizar **GraphQL** como camada de acesso aos dados do Delivery.
* Implementar autenticação de clientes.
* Criar e gerenciar pedidos.
* Validar produtos e quantidades antes da criação do pedido.
* Manter as responsabilidades do ERP e do Delivery separadas.
* Explorar uma arquitetura semelhante à utilizada em aplicações reais.

---

## 🛠️ Tecnologias

### Backend

* **Node.js**
* **TypeScript**
* **Express**
* **GraphQL**
* **Apollo Server**
* **Prisma**
* **PostgreSQL**
* **Zod**

### Autenticação

* **Supabase Auth**

### Integração

* API REST do **Senzalas ERP**
* GraphQL como API do Delivery

### Futuramente

* Docker
* CI/CD
* Deploy em cloud
* Pagamentos online
* Sistema de acompanhamento de pedidos

---

## 🧠 Arquitetura

O projeto utiliza uma arquitetura em que o **Delivery funciona como um sistema independente do ERP**, mas integrado a ele.

### Senzalas ERP

O ERP é responsável pelos dados operacionais do estabelecimento, como:

* Produtos
* Categorias
* Estoque
* Preços
* Vendas
* Fornecedores
* Clientes
* Relatórios

### Senzalas Delivery

O Delivery será responsável por:

* Usuários
* Autenticação
* Catálogo para o cliente
* Carrinho
* Pedidos
* Endereço de entrega
* Status do pedido
* Comunicação com o ERP

---

# 🔌 Integração com o ERP

O Delivery consome a API do Senzalas ERP para obter informações dos produtos.

Por exemplo:

```text
Cliente
   │
   │ consulta produtos
   ▼
Delivery
   │
   │ GraphQL
   ▼
GraphQL Resolver
   │
   │ chama serviço
   ▼
ERP Service
   │
   │ HTTP Request
   ▼
Senzalas ERP
   │
   ▼
Produtos
```

O **ERP Service** funciona como uma camada responsável pela comunicação entre os dois sistemas.

Isso evita que os resolvers GraphQL precisem conhecer diretamente os detalhes da API do ERP.

---

## 🔷 GraphQL

O Delivery utiliza GraphQL como camada de comunicação com o frontend.

Exemplo de consulta:

```graphql
query {
  products {
    id
    name
    salePrice
    category
  }
}
```

O resolver recebe a requisição e utiliza o serviço responsável pela integração com o ERP:

```text
GraphQL Query
      ↓
Resolver
      ↓
ERP Service
      ↓
ERP API
      ↓
Product Data
```

Essa abordagem permite que o frontend solicite apenas os campos necessários.

---

# 🔐 Autenticação

A autenticação dos usuários será realizada utilizando **Supabase Auth**.

Fluxo esperado:

```text
Cliente
   │
   │ Login
   ▼
Supabase Auth
   │
   │ Token
   ▼
Delivery
   │
   │ usuário autenticado
   ▼
Pedidos / Perfil / Endereço
```

O Supabase será responsável pela identidade do usuário, enquanto o backend do Delivery será responsável pelas regras de negócio relacionadas aos pedidos.

---

# 🛒 Pedidos

O fluxo principal do Delivery será:

```text
1. Cliente acessa o Delivery
          ↓
2. Consulta produtos
          ↓
3. Adiciona produtos ao carrinho
          ↓
4. Informa endereço
          ↓
5. Confirma o pedido
          ↓
6. Delivery valida os produtos
          ↓
7. Delivery cria o pedido
          ↓
8. Pedido é enviado/processado
          ↓
9. Cliente acompanha o status
```

Antes de criar um pedido, o backend deverá validar as informações recebidas.

Exemplo:

```json
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 5,
      "quantity": 1
    }
  ]
}
```

O backend será responsável por verificar informações como:

* Produto existente
* Quantidade válida
* Preço
* Disponibilidade
* Dados do cliente
* Endereço de entrega

---

# 📂 Estrutura planejada

Uma possível estrutura para o backend:

```text
DELIVERY/
│
├── src/
│   ├── config/
│   │
│   ├── controllers/
│   │
│   ├── graphql/
│   │   ├── resolvers/
│   │   └── typeDefs/
│   │
│   ├── middlewares/
│   │
│   ├── routes/
│   │
│   ├── services/
│   │   ├── erp.service.ts
│   │   ├── order.service.ts
│   │   └── auth.service.ts
│   │
│   ├── schemas/
│   │
│   ├── prisma/
│   │
│   ├── app.ts
│   └── server.ts
│
├── prisma/
│   └── schema.prisma
│
├── .env
├── package.json
├── tsconfig.json
└── README.md
```

A estrutura pode evoluir conforme novas funcionalidades forem adicionadas.

---

# 🗄️ Banco de dados

O banco do Delivery terá apenas os dados necessários para o funcionamento do sistema.

Exemplos de entidades:

```text
User
  │
  ├── Address
  │
  └── Order
        │
        └── OrderItem
```

Enquanto isso, os dados dos produtos continuam sendo responsabilidade do ERP.

### Exemplo conceitual

```text
Delivery Database

User
Address
Order
OrderItem


ERP Database

Product
Category
Stock
Sale
Customer
Supplier
...
```

Essa separação reduz o acoplamento entre os sistemas.

---


# 🚧 Roadmap

## Backend

* [x] Inicialização do projeto
* [x] Configuração do TypeScript
* [x] Configuração do Express
* [x] Configuração do GraphQL
* [x] Estrutura inicial do projeto
* [x] Serviço de integração com o ERP
* [x] Query de produtos
* [x] Mutation de venda
* [ ] Tratamento de erros da API do ERP
* [ ] Autenticação com Supabase
* [ ] Modelagem do banco
* [ ] Criação de pedidos
* [ ] Validação de pedidos
* [ ] Endereços
* [ ] Status dos pedidos
* [ ] Integração completa com o ERP

## Frontend

* [ ] Landing page
* [ ] Catálogo de produtos
* [ ] Categorias
* [ ] Página do produto
* [ ] Carrinho
* [ ] Login
* [ ] Cadastro
* [ ] Endereço
* [ ] Checkout
* [ ] Meus pedidos
* [ ] Acompanhamento do pedido

## Infraestrutura

* [ ] Docker
* [ ] Variáveis de ambiente
* [ ] CI/CD
* [ ] Deploy do backend
* [ ] Deploy do frontend
* [ ] Monitoramento
* [ ] Logs

---

# 🧪 Testes

O projeto deverá possuir testes para as principais regras de negócio.

Áreas planejadas:

* Autenticação
* Consulta de produtos
* Criação de pedidos
* Validação de quantidade
* Integração com o ERP
* Regras de negócio
* Resolvers GraphQL

---


# 📚 O que este projeto explora

Além de ser uma aplicação de delivery, o projeto foi desenvolvido como um laboratório prático para estudar conceitos utilizados no desenvolvimento de sistemas modernos:

* Arquitetura de aplicações
* Microsserviços e integração entre sistemas
* APIs REST
* GraphQL
* Apollo Server
* Node.js
* TypeScript
* Prisma ORM
* PostgreSQL
* Autenticação
* Supabase
* Validação de dados
* Separação de responsabilidades
* Comunicação entre APIs
* Docker
* CI/CD
* Deploy em cloud

---

# 🔗 Ecossistema Senzalas

O Delivery faz parte do ecossistema de aplicações do **Senzalas**.

```text
                 ┌──────────────────┐
                 │   Senzalas ERP   │
                 │                  │
                 │ Gestão do negócio│
                 └────────┬─────────┘
                          │
                          │ API
                          ▼
                 ┌──────────────────┐
                 │ Senzalas Delivery│
                 │                  │
                 │ Pedidos online   │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │     Cliente      │
                 │                  │
                 │ Compra produtos  │
                 └──────────────────┘
```

O objetivo é construir uma arquitetura em que diferentes aplicações possam utilizar os mesmos dados e serviços, mantendo cada sistema responsável pelo seu próprio domínio.

---

## 👨‍💻 Autor

**João Victor Belizario dos Santos**

Desenvolvedor em formação, com foco em **Back-end e Full Stack**.

Tecnologias de interesse:

`JavaScript` · `TypeScript` · `Node.js` · `React` · `Next.js` · `PostgreSQL` · `Prisma` · `GraphQL`

---

## 📌 Status

🚧 **Projeto em desenvolvimento**

O Senzalas Delivery está sendo desenvolvido de forma incremental, começando pelo backend e pela integração com o Senzalas ERP antes da construção completa da interface do cliente.
