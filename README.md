# Pokedex em Grafos

Aplicacao web completa desenvolvida como trabalho academico da UEG, usando uma Pokedex como tema e banco de dados em grafos para representar relacoes entre Pokemon, tipos, habilidades, fraquezas, evolucoes, usuarios, favoritos e equipes.

## Tecnologias

- Front-end: HTML, CSS e JavaScript puro
- Back-end: Node.js + Express
- Banco de dados: Neo4j
- Autenticacao: JWT + bcrypt
- Ambiente: Docker e Docker Compose

## Estrutura

```text
pokedex/
├── backend/    -> API REST Node.js + Express + Neo4j
├── frontend/   -> Interface web HTML, CSS e JavaScript puro
├── Dockerfile  -> Imagem da aplicacao
└── docker-compose.yml -> Servicos app + neo4j, rede e volumes
```

## Como rodar com Docker

Na raiz do projeto, execute:

```bash
docker compose up --build
```

Depois acesse:

- Aplicacao: http://localhost:3000/app
- Neo4j Browser: http://localhost:7474

Login do Neo4j:

```text
Usuario: neo4j
Senha: pokedex123
```

Login inicial da aplicacao:

```text
E-mail: admin@pokedex.local
Senha: pokedex123
```

## Como os dados sao armazenados

O sistema usa Neo4j, entao os dados sao armazenados como nos e relacionamentos.

Exemplos de nos:

- `Usuario`
- `Pokemon`
- `Tipo`
- `Equipe`
- `Habilidade`

Exemplos de relacionamentos:

```text
(Pokemon)-[:TEM_TIPO]->(Tipo)
(Pokemon)-[:TEM_FRAQUEZA]->(Tipo)
(Pokemon)-[:TEM_HABILIDADE]->(Habilidade)
(Pokemon)-[:EVOLUI_PARA]->(Pokemon)
(Usuario)-[:FAVORITOU]->(Pokemon)
(Usuario)-[:CRIOU_EQUIPE]->(Equipe)
(Equipe)-[:TEM_MEMBRO]->(Pokemon)
```

Para visualizar o grafo no Neo4j Browser:

```cypher
MATCH (n)-[r]->(m) RETURN n, r, m LIMIT 50;
```

## Endpoints principais

### Auth

| Metodo | Rota | Descricao | Auth? |
|---|---|---|---|
| POST | `/auth/cadastro` | Cadastra usuario | Nao |
| POST | `/auth/login` | Faz login e retorna JWT | Nao |

### Pokemons

| Metodo | Rota | Descricao | Auth? |
|---|---|---|---|
| GET | `/pokemons` | Lista todos os Pokemon | Nao |
| GET | `/pokemons/:id` | Busca um Pokemon | Nao |
| POST | `/pokemons` | Cria Pokemon | Sim |
| PUT | `/pokemons/:id` | Atualiza Pokemon | Sim |
| DELETE | `/pokemons/:id` | Remove Pokemon | Sim |

### Tipos

| Metodo | Rota | Descricao | Auth? |
|---|---|---|---|
| GET | `/tipos` | Lista todos os tipos | Nao |
| GET | `/tipos/:id` | Busca um tipo | Nao |
| POST | `/tipos` | Cria tipo | Sim |
| PUT | `/tipos/:id` | Atualiza tipo | Sim |
| DELETE | `/tipos/:id` | Remove tipo | Sim |

### Usuario, favoritos e equipes

| Metodo | Rota | Descricao | Auth? |
|---|---|---|---|
| GET | `/usuarios/favoritos` | Lista favoritos do usuario | Sim |
| POST | `/usuarios/favoritos/:id` | Adiciona Pokemon aos favoritos | Sim |
| DELETE | `/usuarios/favoritos/:id` | Remove Pokemon dos favoritos | Sim |
| GET | `/usuarios/equipes` | Lista equipes do usuario | Sim |
| POST | `/usuarios/equipes` | Cria equipe com Pokemon | Sim |

### Grafo

| Metodo | Rota | Descricao | Auth? |
|---|---|---|---|
| GET | `/graph` | Retorna nos e relacionamentos para visualizacao | Nao |
| GET | `/health` | Verifica se a API esta online | Nao |

## Comandos uteis

Listar containers:

```bash
docker ps
```

Listar imagens:

```bash
docker images
```

Listar rede e volumes do projeto:

```bash
docker network ls --filter name=pokedex
docker volume ls --filter name=pokedex
```

Parar o ambiente:

```bash
docker compose down
```

Parar o ambiente removendo volumes:

```bash
docker compose down -v
```

Use `docker compose down -v` apenas quando quiser apagar os dados persistidos do Neo4j.
