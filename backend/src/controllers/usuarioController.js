const { runRead, runWrite, toNative } = require('../database');

async function favoritos(req, res, next) {
  try {
    const records = await runRead(`
      MATCH (u:Usuario {id: $usuarioId})-[:FAVORITOU]->(p:Pokemon)
      RETURN p ORDER BY p.numero
    `, { usuarioId: req.usuarioId });
    res.json(records.map((record) => toNative(record.get('p'))));
  } catch (err) {
    next(err);
  }
}

async function favoritar(req, res, next) {
  try {
    const records = await runWrite(`
      MATCH (u:Usuario {id: $usuarioId}), (p:Pokemon {id: $pokemonId})
      MERGE (u)-[:FAVORITOU]->(p)
      RETURN p
    `, { usuarioId: req.usuarioId, pokemonId: req.params.id });

    if (!records.length) return res.status(404).json({ erro: 'Usuario ou Pokemon nao encontrado.' });
    res.status(201).json({ mensagem: 'Pokemon favoritado.' });
  } catch (err) {
    next(err);
  }
}

async function removerFavorito(req, res, next) {
  try {
    await runWrite(`
      MATCH (:Usuario {id: $usuarioId})-[r:FAVORITOU]->(:Pokemon {id: $pokemonId})
      DELETE r
    `, { usuarioId: req.usuarioId, pokemonId: req.params.id });
    res.json({ mensagem: 'Favorito removido.' });
  } catch (err) {
    next(err);
  }
}

async function equipes(req, res, next) {
  try {
    const records = await runRead(`
      MATCH (u:Usuario {id: $usuarioId})-[:CRIOU_EQUIPE]->(e:Equipe)
      OPTIONAL MATCH (e)-[:TEM_MEMBRO]->(p:Pokemon)
      WITH e, collect(p {.*}) AS pokemons
      RETURN e {.*, pokemons: pokemons} AS equipe
      ORDER BY equipe.nome
    `, { usuarioId: req.usuarioId });
    res.json(records.map((record) => toNative(record.get('equipe'))));
  } catch (err) {
    next(err);
  }
}

async function criarEquipe(req, res, next) {
  try {
    const { nome, pokemonIds = [] } = req.body;
    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: 'Campo "nome" da equipe e obrigatorio.' });
    }

    const records = await runWrite(`
      MATCH (u:Usuario {id: $usuarioId})
      CREATE (e:Equipe {id: randomUUID(), nome: $nome, createdAt: datetime()})
      MERGE (u)-[:CRIOU_EQUIPE]->(e)
      WITH e
      CALL {
        WITH e
        UNWIND $pokemonIds AS pokemonId
        MATCH (p:Pokemon {id: pokemonId})
        MERGE (e)-[:TEM_MEMBRO]->(p)
        RETURN count(p) AS membrosCriados
      }
      OPTIONAL MATCH (e)-[:TEM_MEMBRO]->(p:Pokemon)
      WITH e, collect(p {.*}) AS pokemons
      RETURN e {.*, pokemons: pokemons} AS equipe
    `, { usuarioId: req.usuarioId, nome, pokemonIds });

    if (!records.length) return res.status(404).json({ erro: 'Usuario nao encontrado.' });
    return res.status(201).json(toNative(records[0].get('equipe')));
  } catch (err) {
    next(err);
  }
}

module.exports = { favoritos, favoritar, removerFavorito, equipes, criarEquipe };
