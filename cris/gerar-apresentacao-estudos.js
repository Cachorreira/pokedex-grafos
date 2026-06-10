const pptxgen = require("pptxgenjs");
const path = require("path");
const fs = require("fs");

const outDir = "C:\\Users\\Kaique Alves\\Downloads\\pokedex-backend\\pokedex";
const output = path.join(outDir, "apresentacao-pokedex-docker.pptx");

const shots = {
  runStopRm: "C:\\Users\\Kaique Alves\\Pictures\\Screenshots\\Captura de tela 2026-06-10 120553.png",
  networkVolume: "C:\\Users\\Kaique Alves\\Pictures\\Screenshots\\Captura de tela 2026-06-10 120630.png",
  app: "C:\\Users\\Kaique Alves\\Pictures\\Screenshots\\Captura de tela 2026-06-10 120813.png",
  neo4j: "C:\\Users\\Kaique Alves\\Pictures\\Screenshots\\Captura de tela 2026-06-10 121129.png",
  ps: "C:\\Users\\Kaique Alves\\Pictures\\Screenshots\\Captura de tela 2026-06-10 120225.png",
  images: "C:\\Users\\Kaique Alves\\Pictures\\Screenshots\\Captura de tela 2026-06-10 120343.png",
  hello: "C:\\Users\\Kaique Alves\\Pictures\\Screenshots\\Captura de tela 2026-06-10 120429.png",
};

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "Kaique Vinícius Oliveira Alves";
pptx.company = "Pokedex em Grafos";
pptx.subject = "Apresentação Docker";
pptx.title = "Pokedex em Grafos com Docker";
pptx.lang = "pt-BR";
pptx.theme = {
  headFontFace: "Aptos Display",
  bodyFontFace: "Aptos",
  lang: "pt-BR",
};
pptx.defineLayout({ name: "LAYOUT_WIDE", width: 13.333, height: 7.5 });

const C = {
  navy: "17202A",
  ink: "253041",
  muted: "64748B",
  line: "D8E2EF",
  bg: "F7FAFC",
  green: "16A34A",
  blue: "2563EB",
  red: "DC2626",
  yellow: "F59E0B",
  purple: "7C3AED",
  softGreen: "E8F7EE",
  softBlue: "EAF2FF",
  softRed: "FDECEC",
  softYellow: "FFF7E6",
};

function addBg(slide) {
  slide.background = { color: "FFFFFF" };
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.333, h: 0.18, fill: { color: C.red }, line: { color: C.red } });
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 7.32, w: 13.333, h: 0.18, fill: { color: C.green }, line: { color: C.green } });
}

function title(slide, text, kicker = "Pokedex em Grafos com Docker") {
  addBg(slide);
  slide.addText(kicker.toUpperCase(), {
    x: 0.55, y: 0.42, w: 8.2, h: 0.25,
    fontFace: "Aptos", fontSize: 8.5, bold: true, color: C.red,
    margin: 0, breakLine: false,
  });
  slide.addText(text, {
    x: 0.55, y: 0.73, w: 11.7, h: 0.58,
    fontFace: "Aptos Display", fontSize: 26, bold: true, color: C.navy,
    margin: 0, fit: "shrink",
  });
}

function footer(slide, n) {
  slide.addText(String(n).padStart(2, "0"), {
    x: 12.38, y: 6.93, w: 0.35, h: 0.18, fontSize: 8.5, color: C.muted,
    align: "right", margin: 0,
  });
}

function bulletList(slide, items, x, y, w, h, opts = {}) {
  const runs = [];
  for (const item of items) {
    runs.push({
      text: item,
      options: {
        bullet: { indent: 14 },
        hanging: 4,
        breakLine: true,
      },
    });
  }
  slide.addText(runs, {
    x, y, w, h,
    fontSize: opts.fontSize || 15,
    color: opts.color || C.ink,
    fit: "shrink",
    valign: "top",
    breakLine: false,
    paraSpaceAfterPt: 7,
    margin: 0.04,
  });
}

function box(slide, x, y, w, h, label, body, fill, accent) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: fill },
    line: { color: C.line, width: 1 },
  });
  slide.addShape(pptx.ShapeType.rect, { x, y, w: 0.08, h, fill: { color: accent }, line: { color: accent } });
  slide.addText(label, { x: x + 0.2, y: y + 0.15, w: w - 0.35, h: 0.22, fontSize: 11, bold: true, color: accent, margin: 0 });
  slide.addText(body, { x: x + 0.2, y: y + 0.46, w: w - 0.35, h: h - 0.58, fontSize: 13.2, color: C.ink, fit: "shrink", valign: "mid", margin: 0 });
}

function codeBlock(slide, text, x, y, w, h, fontSize = 10.5) {
  slide.addShape(pptx.ShapeType.roundRect, {
    x, y, w, h,
    rectRadius: 0.08,
    fill: { color: "111827" },
    line: { color: "111827" },
  });
  slide.addText(text, {
    x: x + 0.12, y: y + 0.12, w: w - 0.24, h: h - 0.22,
    fontFace: "Consolas", fontSize, color: "F8FAFC",
    fit: "shrink", margin: 0.02, breakLine: false,
  });
}

function addImage(slide, file, x, y, w, h) {
  if (fs.existsSync(file)) {
    slide.addImage({ path: file, x, y, w, h, sizingCrop: false });
    slide.addShape(pptx.ShapeType.rect, { x, y, w, h, fill: { color: "FFFFFF", transparency: 100 }, line: { color: C.line, width: 1 } });
  } else {
    box(slide, x, y, w, h, "Imagem não encontrada", file, C.softRed, C.red);
  }
}

function notes(slide, lines) {
  slide.addNotes(lines.join("\n"));
}

let s = 1;

{
  const slide = pptx.addSlide();
  addBg(slide);
  slide.addText("NEO4J + EXPRESS + DOCKER", { x: 0.72, y: 0.78, w: 4.8, h: 0.25, fontSize: 10, bold: true, color: C.red, margin: 0 });
  slide.addText("Pokedex em Grafos\ncom Docker", { x: 0.72, y: 1.12, w: 7.5, h: 1.15, fontFace: "Aptos Display", fontSize: 35, bold: true, color: C.navy, fit: "shrink", margin: 0 });
  slide.addText("Uma explicação guiada sobre como a aplicação foi empacotada, executada em containers e conectada ao banco Neo4j.", { x: 0.72, y: 2.52, w: 6.25, h: 0.75, fontSize: 16, color: C.ink, fit: "shrink", margin: 0 });
  slide.addShape(pptx.ShapeType.roundRect, { x: 8.15, y: 0.9, w: 4.25, h: 5.35, rectRadius: 0.12, fill: { color: C.bg }, line: { color: C.line } });
  addImage(slide, shots.app, 8.35, 1.1, 3.85, 2.25);
  addImage(slide, shots.neo4j, 8.35, 3.62, 3.85, 2.25);
  slide.addText("Integrantes: Kaique, Gustavo, Pedro, Matheus e Peterson", { x: 0.72, y: 6.35, w: 8.1, h: 0.32, fontSize: 12.5, color: C.muted, margin: 0 });
  footer(slide, s++);
  notes(slide, [
    "Comece explicando que a apresentação não é apenas sobre a tela da Pokedex.",
    "O foco principal é mostrar como a aplicação foi organizada para rodar em Docker, com aplicação e banco em containers separados.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Por que usamos Docker neste projeto?");
  bulletList(slide, [
    "O Docker permite executar a aplicação em um ambiente padronizado, independente das configurações da máquina.",
    "A aplicação e o banco Neo4j ficam isolados em containers, mas conectados por uma rede própria.",
    "O Docker Compose reduz o processo de execução a um comando principal: docker compose up --build.",
    "Com volumes, os dados do banco podem continuar existindo mesmo quando o container é reiniciado.",
  ], 0.75, 1.72, 7.0, 3.4);
  box(slide, 8.15, 1.55, 4.35, 1.25, "Ideia principal", "Em vez de depender de instalações manuais, o projeto descreve sua infraestrutura em arquivos.", C.softBlue, C.blue);
  box(slide, 8.15, 3.05, 4.35, 1.25, "O que o professor deve ver", "Containers ativos, imagem criada, portas publicadas, rede personalizada e volumes persistentes.", C.softGreen, C.green);
  box(slide, 8.15, 4.55, 4.35, 1.25, "Resultado esperado", "A Pokedex abre no navegador e o Neo4j mostra os dados armazenados como grafo.", C.softYellow, C.yellow);
  footer(slide, s++);
  notes(slide, [
    "Aqui vale falar de forma simples: Docker é a embalagem do ambiente.",
    "Ele evita que o projeto dependa de versões instaladas manualmente na máquina de apresentação.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Arquitetura geral do ambiente");
  const y = 2.2;
  box(slide, 0.75, y, 2.3, 1.25, "Navegador", "Usuário acessa localhost:3000/app", C.softBlue, C.blue);
  box(slide, 4.0, y, 2.55, 1.25, "Container app", "Backend Express + frontend compilado", C.softGreen, C.green);
  box(slide, 7.5, y, 2.6, 1.25, "Container Neo4j", "Banco de dados em grafo", C.softYellow, C.yellow);
  box(slide, 10.75, y, 1.9, 1.25, "Volume", "Persistência dos dados", C.softRed, C.red);
  slide.addShape(pptx.ShapeType.rightArrow, { x: 3.15, y: y + 0.35, w: 0.65, h: 0.42, fill: { color: C.muted }, line: { color: C.muted } });
  slide.addShape(pptx.ShapeType.rightArrow, { x: 6.75, y: y + 0.35, w: 0.65, h: 0.42, fill: { color: C.muted }, line: { color: C.muted } });
  slide.addShape(pptx.ShapeType.rightArrow, { x: 10.28, y: y + 0.35, w: 0.35, h: 0.42, fill: { color: C.muted }, line: { color: C.muted } });
  slide.addText("Rede Docker personalizada: pokedex_net", { x: 4.0, y: 4.05, w: 6.1, h: 0.35, fontSize: 18, bold: true, color: C.navy, align: "center", margin: 0 });
  slide.addText("Dentro dessa rede, o backend não usa localhost para encontrar o banco. Ele usa o nome do serviço: neo4j.", { x: 2.25, y: 4.55, w: 8.8, h: 0.55, fontSize: 14.5, color: C.ink, align: "center", fit: "shrink", margin: 0 });
  footer(slide, s++);
  notes(slide, [
    "Explique o fluxo: navegador chama o app na porta 3000, o backend consulta o banco pelo protocolo Bolt, e o banco grava em volume.",
    "Esse slide ajuda a conectar Docker com o funcionamento real da aplicação.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Dockerfile: a imagem da aplicação");
  codeBlock(slide, `FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-alpine AS app
WORKDIR /app
ENV NODE_ENV=production
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --omit=dev
COPY backend ./backend
COPY --from=frontend-build /app/frontend/dist ./frontend/dist
WORKDIR /app/backend
EXPOSE 3000
CMD ["npm", "start"]`, 0.72, 1.55, 5.85, 4.95, 9.2);
  bulletList(slide, [
    "A primeira etapa compila o frontend.",
    "A segunda etapa prepara o backend para produção.",
    "O resultado final junta o backend com a pasta dist do frontend.",
    "Quando o container inicia, ele executa npm start e escuta na porta 3000.",
  ], 7.05, 1.75, 5.25, 3.1, { fontSize: 15 });
  box(slide, 7.05, 5.05, 5.25, 0.95, "Como explicar", "O Dockerfile funciona como a receita da imagem: ele diz qual base usar, quais arquivos copiar, quais dependências instalar e qual comando iniciar.", C.softBlue, C.blue);
  footer(slide, s++);
  notes(slide, [
    "Não precisa decorar linha por linha, mas precisa entender a lógica.",
    "Diga que multi-stage build evita misturar a etapa de construção do frontend com a etapa final de execução.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Docker Compose: dois serviços trabalhando juntos");
  codeBlock(slide, `services:
  neo4j:
    image: neo4j:5-community
    container_name: pokedex-neo4j
    environment:
      NEO4J_AUTH: neo4j/pokedex123
    ports:
      - "7474:7474"
      - "7687:7687"
    volumes:
      - neo4j_data:/data
      - neo4j_logs:/logs
    networks:
      - pokedex_net

  app:
    build: .
    container_name: pokedex-app
    depends_on:
      - neo4j
    restart: on-failure`, 0.72, 1.55, 5.9, 4.85, 9);
  box(slide, 7.0, 1.55, 5.45, 1.2, "Serviço neo4j", "É o banco em grafo. Publica a porta 7474 para o navegador e a porta 7687 para o backend.", C.softYellow, C.yellow);
  box(slide, 7.0, 3.05, 5.45, 1.2, "Serviço app", "É a aplicação. A imagem é construída pelo Dockerfile e o container publica a porta 3000.", C.softGreen, C.green);
  box(slide, 7.0, 4.55, 5.45, 1.2, "Compose", "Coordena tudo: serviços, portas, variáveis de ambiente, volumes e rede.", C.softBlue, C.blue);
  footer(slide, s++);
  notes(slide, [
    "Mostre que o Compose não é código da aplicação; ele é a descrição do ambiente.",
    "É aqui que aparecem os dois serviços obrigatórios do trabalho.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Variáveis de ambiente e conexão com o banco");
  codeBlock(slide, `environment:
  PORT: 3000
  NEO4J_URI: bolt://neo4j:7687
  NEO4J_USER: neo4j
  NEO4J_PASSWORD: pokedex123
  JWT_SECRET: pokedex_backend_dev_secret_2026`, 0.78, 1.58, 5.75, 1.9, 12);
  codeBlock(slide, `const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(
    process.env.NEO4J_USER,
    process.env.NEO4J_PASSWORD
  )
);`, 0.78, 4.0, 5.75, 2.0, 11);
  bulletList(slide, [
    "As configurações sensíveis não ficam fixas no código principal.",
    "O backend lê a URI, usuário e senha a partir do ambiente do container.",
    "O endereço bolt://neo4j:7687 funciona porque app e Neo4j estão na mesma rede Docker.",
    "O JWT_SECRET é usado para assinar o token de autenticação do usuário.",
  ], 7.08, 1.6, 5.15, 4.25, { fontSize: 14.5 });
  footer(slide, s++);
  notes(slide, [
    "Esse é um bom momento para explicar por que localhost não é usado dentro do container.",
    "O Compose cria uma espécie de DNS interno: o nome do serviço vira endereço.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Rede e volumes: comunicação e persistência");
  addImage(slide, shots.networkVolume, 0.75, 1.55, 5.8, 1.55);
  box(slide, 0.75, 3.55, 5.8, 1.15, "Rede personalizada", "A rede pokedex_net permite que app e neo4j conversem pelo nome dos serviços.", C.softBlue, C.blue);
  box(slide, 0.75, 5.0, 5.8, 1.15, "Volumes persistentes", "neo4j_data guarda os dados do banco; neo4j_logs guarda os registros do Neo4j.", C.softGreen, C.green);
  bulletList(slide, [
    "Sem rede, os containers não teriam uma comunicação organizada entre si.",
    "Sem volume, recriar o container do banco poderia apagar os dados armazenados.",
    "A persistência é essencial para favoritos, equipes e dados cadastrados.",
  ], 7.05, 1.7, 5.25, 3.05, { fontSize: 15 });
  footer(slide, s++);
  notes(slide, [
    "Use a imagem para mostrar que os nomes da rede e dos volumes realmente existem no Docker.",
    "Reforce que container é descartável, mas volume é feito para guardar dados.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Comandos básicos usados nos testes");
  const rows = [
    ["docker run --rm hello-world", "confirma que o Docker consegue executar uma imagem"],
    ["docker compose up --build", "constrói a imagem e sobe app + banco"],
    ["docker ps", "mostra os containers em execução"],
    ["docker images", "lista as imagens disponíveis"],
    ["docker stop", "para um container"],
    ["docker rm", "remove um container parado"],
  ];
  let y = 1.58;
  for (const [cmd, desc] of rows) {
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.78, y, w: 11.75, h: 0.54, rectRadius: 0.06, fill: { color: y % 1 > 0.5 ? "FFFFFF" : C.bg }, line: { color: C.line } });
    slide.addText(cmd, { x: 0.98, y: y + 0.13, w: 3.65, h: 0.2, fontFace: "Consolas", fontSize: 11.2, bold: true, color: C.navy, margin: 0 });
    slide.addText(desc, { x: 4.85, y: y + 0.12, w: 7.1, h: 0.22, fontSize: 12.5, color: C.ink, margin: 0 });
    y += 0.68;
  }
  box(slide, 0.78, 6.05, 11.75, 0.62, "Como apresentar", "Não é necessário executar todos demoradamente; mostre os prints ou rode os principais para comprovar que o ambiente funciona.", C.softYellow, C.yellow);
  footer(slide, s++);
  notes(slide, [
    "Explique cada comando pelo objetivo, não apenas pelo nome.",
    "O professor quer ver evidência de execução, então os prints e os comandos no terminal são importantes.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Evidências: Docker em execução");
  addImage(slide, shots.ps, 0.65, 1.5, 6.05, 2.45);
  addImage(slide, shots.images, 6.95, 1.5, 5.75, 2.45);
  addImage(slide, shots.hello, 0.65, 4.3, 6.05, 2.15);
  addImage(slide, shots.runStopRm, 6.95, 4.3, 5.75, 2.15);
  footer(slide, s++);
  notes(slide, [
    "Aqui você pode dizer que essas telas comprovam que o Docker executa containers, lista imagens e controla o ciclo de vida deles.",
    "O docker ps mostra app e Neo4j ativos.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Backend dentro do container app");
  bulletList(slide, [
    "app.js inicializa o servidor Express, configura rotas e serve o frontend compilado.",
    "database.js abre a conexão com o Neo4j usando variáveis de ambiente.",
    "seed.js cria dados iniciais para o grafo aparecer populado.",
    "controllers concentram as regras de login, Pokémon, favoritos, equipes e grafo.",
    "middlewares validam token JWT, tratam erros, logs e entradas inválidas.",
  ], 0.75, 1.62, 6.25, 3.6, { fontSize: 14.6 });
  box(slide, 7.35, 1.65, 4.85, 1.05, "Autenticação", "bcrypt protege a senha; JWT identifica o usuário nas próximas requisições.", C.softBlue, C.blue);
  box(slide, 7.35, 3.05, 4.85, 1.05, "Favoritos", "O usuário se relaciona com Pokémon por FAVORITOU.", C.softGreen, C.green);
  box(slide, 7.35, 4.45, 4.85, 1.05, "Equipes", "O usuário cria uma Equipe, e a equipe recebe membros Pokémon.", C.softYellow, C.yellow);
  footer(slide, s++);
  notes(slide, [
    "A explicação aqui deve conectar código com Docker: todo esse backend roda dentro do container app.",
    "Mostre que o backend não salva dados em arquivo local; ele manda para o Neo4j.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Como os dados são armazenados em grafo");
  codeBlock(slide, `(u:Usuario)-[:FAVORITOU]->(p:Pokemon)
(u:Usuario)-[:CRIOU_EQUIPE]->(e:Equipe)
(e:Equipe)-[:TEM_MEMBRO]->(p:Pokemon)
(p:Pokemon)-[:TEM_TIPO]->(t:Tipo)
(p:Pokemon)-[:EVOLUI_PARA]->(p2:Pokemon)
(p:Pokemon)-[:TEM_FRAQUEZA]->(t:Tipo)
(p:Pokemon)-[:TEM_HABILIDADE]->(h:Habilidade)`, 0.72, 1.55, 5.95, 2.65, 11.5);
  addImage(slide, shots.neo4j, 7.05, 1.55, 5.55, 3.45);
  slide.addText("No Neo4j, o dado mais importante não é apenas o cadastro isolado, mas também a relação entre os elementos.", {
    x: 0.75, y: 4.65, w: 5.9, h: 0.75, fontSize: 15, color: C.ink, fit: "shrink", margin: 0,
  });
  box(slide, 7.05, 5.28, 5.55, 0.75, "Exemplo de leitura", "Um Pokémon pode ter tipo, fraqueza, habilidade e evolução; um usuário pode favoritar ou montar equipes.", C.softGreen, C.green);
  footer(slide, s++);
  notes(slide, [
    "Compare com tabela de forma simples: em grafo, a relação aparece como parte central do modelo.",
    "Mostre o Neo4j Browser como prova visual desses nós e relacionamentos.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Aplicação funcionando no navegador");
  addImage(slide, shots.app, 0.75, 1.55, 7.25, 4.25);
  bulletList(slide, [
    "A porta 3000 do container é publicada na máquina local.",
    "O navegador acessa a tela da Pokedex em localhost:3000/app.",
    "A indicação API online mostra que o frontend está conseguindo conversar com o backend.",
    "As ações de login, favoritos e equipes dependem do backend e do banco Neo4j.",
  ], 8.35, 1.75, 4.25, 3.15, { fontSize: 14.3 });
  footer(slide, s++);
  notes(slide, [
    "Esse slide é a demonstração mais fácil de entender para quem não conhece Docker.",
    "Explique que a tela bonita é só a ponta; por trás estão os containers e o banco.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Divisão da fala entre os 5 integrantes");
  const parts = [
    ["Kaique", "Introdução, objetivo do projeto e visão geral da arquitetura Docker."],
    ["Gustavo", "Dockerfile: imagem da aplicação, multi-stage build e porta 3000."],
    ["Pedro", "Docker Compose: serviços app e neo4j, variáveis e portas."],
    ["Matheus", "Comandos de teste, docker ps, images, stop, rm, redes e volumes."],
    ["Peterson", "Backend, seed, controllers e armazenamento dos dados em grafo."],
  ];
  let y = 1.45;
  for (const [name, desc] of parts) {
    slide.addShape(pptx.ShapeType.roundRect, { x: 0.8, y, w: 11.75, h: 0.82, rectRadius: 0.08, fill: { color: C.bg }, line: { color: C.line } });
    slide.addText(name, { x: 1.05, y: y + 0.22, w: 1.55, h: 0.24, fontSize: 14, bold: true, color: C.red, margin: 0 });
    slide.addText(desc, { x: 2.75, y: y + 0.2, w: 9.25, h: 0.3, fontSize: 13.5, color: C.ink, fit: "shrink", margin: 0 });
    y += 0.98;
  }
  footer(slide, s++);
  notes(slide, [
    "Esse slide serve para organizar a apresentação e evitar repetição.",
    "Cada pessoa deve falar da sua parte, mas todas devem entender a sequência geral.",
  ]);
}

{
  const slide = pptx.addSlide();
  title(slide, "Fechamento: o que o projeto comprova");
  bulletList(slide, [
    "A aplicação possui Dockerfile funcional e gera uma imagem personalizada.",
    "O ambiente é multi-container, com aplicação e banco separados.",
    "O Docker Compose automatiza serviços, portas, variáveis, rede e volumes.",
    "O Neo4j guarda os dados como grafo e mantém persistência por volume.",
    "Os prints e comandos comprovam a execução do ambiente e da aplicação.",
  ], 0.9, 1.65, 7.1, 3.2, { fontSize: 16 });
  box(slide, 8.35, 1.65, 3.8, 1.15, "Mensagem final", "O sistema não foi apenas desenvolvido; ele foi preparado para rodar de forma reproduzível em containers.", C.softGreen, C.green);
  box(slide, 8.35, 3.15, 3.8, 1.15, "Demonstração", "Terminal + navegador + Neo4j Browser mostram que o ambiente está funcionando.", C.softBlue, C.blue);
  box(slide, 8.35, 4.65, 3.8, 1.15, "Aprendizado", "Docker separa aplicação, banco e infraestrutura de uma forma organizada.", C.softYellow, C.yellow);
  footer(slide, s++);
  notes(slide, [
    "Finalize com segurança: o trabalho atende aos pontos principais de Docker exigidos.",
    "Se houver pergunta, volte aos slides de Compose, rede e volume.",
  ]);
}

pptx.writeFile({ fileName: output });
