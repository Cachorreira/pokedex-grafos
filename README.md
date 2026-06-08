# Pokédex — Projeto Full Stack

Aplicação web completa desenvolvida como trabalho acadêmico da UEG.

## Estrutura

```
pokedex/
├── backend/    → API REST (Node.js + Express + Sequelize + PostgreSQL)
└── frontend/   → Interface web (HTML, CSS, JavaScript puro)
```

## Como rodar o backend

### 1. Instale as dependências
```bash
cd backend
npm install
```

### 2. Configure o banco
Copie o `.env.example` para `.env` e preencha com seus dados:
```bash
cp .env.example .env
```

Crie o banco no PostgreSQL:
```sql
CREATE DATABASE pokedex;
```

### 3. Suba o servidor
```bash
npm run dev
```

O servidor vai rodar em `http://localhost:3000`.

## Endpoints

### Auth
| Método | Rota            | Descrição         | Auth? |
|--------|-----------------|-------------------|-------|
| POST   | /auth/cadastro  | Cadastra usuário  | Não   |
| POST   | /auth/login     | Faz login         | Não   |

### Pokémons
| Método | Rota            | Descrição              | Auth? |
|--------|-----------------|------------------------|-------|
| GET    | /pokemons       | Lista todos            | Não   |
| GET    | /pokemons/:id   | Busca um               | Não   |
| POST   | /pokemons       | Cria pokémon           | Sim   |
| PUT    | /pokemons/:id   | Atualiza pokémon       | Sim   |
| DELETE | /pokemons/:id   | Remove pokémon         | Sim   |

### Moves
| Método | Rota        | Descrição       | Auth? |
|--------|-------------|-----------------|-------|
| GET    | /moves      | Lista todos     | Não   |
| GET    | /moves/:id  | Busca um        | Não   |
| POST   | /moves      | Cria move       | Sim   |
| PUT    | /moves/:id  | Atualiza move   | Sim   |
| DELETE | /moves/:id  | Remove move     | Sim   |

### Tipos
| Método | Rota    | Descrição     | Auth? |
|--------|---------|---------------|-------|
| GET    | /tipos  | Lista todos   | Não   |
| POST   | /tipos  | Cria tipo     | Sim   |
