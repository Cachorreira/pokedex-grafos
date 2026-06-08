# Pokedex em Grafos

Aplicacao atualizada para usar:

- Frontend: HTML, CSS e JavaScript puro com Vite.
- Backend: Node.js + Express.
- Banco: Neo4j.
- Autenticacao: JWT + bcrypt.
- Docker: Dockerfile da aplicacao e Docker Compose com `app` e `neo4j`.
- Persistencia: volumes Docker para dados e logs do Neo4j.
- Rede: rede personalizada `pokedex_net`.
- Ambiente: variaveis no `.env`.

## Como rodar com Docker

Na raiz do projeto:

```bash
docker compose up --build
```

Servicos:

- App/API: http://localhost:3000
- Neo4j Browser: http://localhost:7474
- Bolt Neo4j: bolt://localhost:7687

Credenciais Neo4j:

```text
Usuario: neo4j
Senha: pokedex123
```

Login inicial da aplicacao:

```text
E-mail: admin@pokedex.local
Senha: pokedex123
```

## Relacoes do grafo

O seed inicial cria nos e relacionamentos:

- `(Pokemon)-[:TEM_TIPO]->(Tipo)`
- `(Pokemon)-[:EVOLUI_PARA]->(Pokemon)`
- `(Pokemon)-[:TEM_FRAQUEZA]->(Tipo)`
- `(Pokemon)-[:TEM_HABILIDADE]->(Habilidade)`
- `(Usuario)-[:FAVORITOU]->(Pokemon)`
- `(Usuario)-[:CRIOU_EQUIPE]->(Equipe)-[:TEM_MEMBRO]->(Pokemon)`

## Variaveis de ambiente

Arquivo `backend/.env`:

```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=pokedex123
JWT_SECRET=pokedex_backend_dev_secret_2026
PORT=3000
```

No Docker Compose, `NEO4J_URI` vira `bolt://neo4j:7687`, pois o app acessa o servico `neo4j` pela rede Docker.
