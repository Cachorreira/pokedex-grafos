require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');

const { driver, verifyConnection } = require('./database');
const { initializeDatabase } = require('./seed');
const logMiddleware = require('./middlewares/log');
const erroMiddleware = require('./middlewares/erro');

const authRoutes = require('./routes/auth');
const pokemonRoutes = require('./routes/pokemons');
const tipoRoutes = require('./routes/tipos');
const graphRoutes = require('./routes/graph');
const usuarioRoutes = require('./routes/usuarios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(logMiddleware);

const frontendDist = path.resolve(__dirname, '..', '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

app.use('/auth', authRoutes);
app.use('/pokemons', pokemonRoutes);
app.use('/tipos', tipoRoutes);
app.use('/graph', graphRoutes);
app.use('/usuarios', usuarioRoutes);

app.get('/health', (req, res) => {
  res.json({ mensagem: 'Pokedex em grafos rodando com Neo4j.' });
});

app.get('/', (req, res) => {
  res.json({ mensagem: 'Pokedex em grafos rodando com Neo4j.' });
});

app.get('/app', (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});

app.use(erroMiddleware);

async function start() {
  try {
    await waitForDatabase();
    await initializeDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
      console.log(`Neo4j conectado em ${process.env.NEO4J_URI}`);
    });

    async function shutdown() {
      server.close(async () => {
        await driver.close();
        process.exit(0);
      });
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (err) {
    console.error('Erro ao iniciar a aplicacao:', err.message);
    process.exit(1);
  }
}

async function waitForDatabase(maxAttempts = 30) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await verifyConnection();
      return;
    } catch (err) {
      const isLastAttempt = attempt === maxAttempts;
      if (isLastAttempt) throw err;

      console.log(`Aguardando Neo4j ficar pronto... tentativa ${attempt}/${maxAttempts}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

start();
