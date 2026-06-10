const { runRead, runWrite, toNative } = require('../database');

const pokemonGraphReturn = `
  RETURN p {
    .*,
    tipo: head([(p)-[:TEM_TIPO]->(t:Tipo) | t {.*}]),
    fraquezas: [(p)-[:TEM_FRAQUEZA]->(f:Tipo) | f {.*}],
    habilidades: [(p)-[:TEM_HABILIDADE]->(h:Habilidade) | h {.*}],
    evoluiPara: head([(p)-[:EVOLUI_PARA]->(e:Pokemon) | e {.*}]),
    evoluiDe: head([(d:Pokemon)-[:EVOLUI_PARA]->(p) | d {.*}])
  } AS pokemon
`;

async function listar(req, res, next) {
  try {
    const records = await runRead(`
      MATCH (p:Pokemon)
      ${pokemonGraphReturn}
      ORDER BY pokemon.numero
    `);
    res.json(records.map((record) => toNative(record.get('pokemon'))));
  } catch (err) {
    next(err);
  }
}

async function buscar(req, res, next) {
  try {
    const records = await runRead(`
      MATCH (p:Pokemon {id: $id})
      ${pokemonGraphReturn}
    `, { id: req.params.id });

    if (!records.length) return res.status(404).json({ erro: 'Pokemon nao encontrado.' });
    res.json(toNative(records[0].get('pokemon')));
  } catch (err) {
    next(err);
  }
}

async function criar(req, res, next) {
  try {
    const {
      nome,
      numero,
      sprite_url,
      descricao,
      tipoId,
      fraquezaIds = [],
      habilidades = [],
      evoluiParaId,
    } = req.body;

    const records = await runWrite(`
      MATCH (tipo:Tipo {id: $tipoId})
      MERGE (p:Pokemon {numero: $numero})
      ON CREATE SET p.id = randomUUID(), p.createdAt = datetime()
      SET p.nome = $nome,
          p.sprite_url = $sprite_url,
          p.descricao = $descricao,
          p.updatedAt = datetime()
      WITH p, tipo
      OPTIONAL MATCH (p)-[oldTipo:TEM_TIPO]->()
      DELETE oldTipo
      WITH p, tipo
      MERGE (p)-[:TEM_TIPO]->(tipo)
      WITH p
      OPTIONAL MATCH (p)-[oldFraqueza:TEM_FRAQUEZA]->()
      DELETE oldFraqueza
      WITH p
      FOREACH (fraquezaId IN $fraquezaIds |
        MERGE (fraqueza:Tipo {id: fraquezaId})
        MERGE (p)-[:TEM_FRAQUEZA]->(fraqueza)
      )
      WITH p
      FOREACH (habilidade IN $habilidades |
        MERGE (h:Habilidade {nome: habilidade.nome})
        ON CREATE SET h.id = randomUUID()
        SET h.descricao = habilidade.descricao
        MERGE (p)-[:TEM_HABILIDADE]->(h)
      )
      WITH p
      OPTIONAL MATCH (p)-[oldEvolucao:EVOLUI_PARA]->()
      DELETE oldEvolucao
      WITH p
      OPTIONAL MATCH (evolucao:Pokemon {id: $evoluiParaId})
      FOREACH (_ IN CASE WHEN evolucao IS NULL THEN [] ELSE [1] END |
        MERGE (p)-[:EVOLUI_PARA]->(evolucao)
      )
      WITH p
      ${pokemonGraphReturn}
    `, {
      nome,
      numero: Number(numero),
      sprite_url: sprite_url || '',
      descricao: descricao || '',
      tipoId,
      fraquezaIds,
      habilidades,
      evoluiParaId: evoluiParaId || null,
    });

    if (!records.length) return res.status(400).json({ erro: 'Tipo nao encontrado.' });
    res.status(201).json(toNative(records[0].get('pokemon')));
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const {
      nome,
      numero,
      sprite_url,
      descricao,
      tipoId,
      fraquezaIds = [],
      habilidades = [],
      evoluiParaId,
    } = req.body;

    const records = await runWrite(`
      MATCH (p:Pokemon {id: $id})
      MATCH (tipo:Tipo {id: $tipoId})
      SET p.nome = $nome,
          p.numero = $numero,
          p.sprite_url = $sprite_url,
          p.descricao = $descricao,
          p.updatedAt = datetime()
      WITH p, tipo
      OPTIONAL MATCH (p)-[oldTipo:TEM_TIPO]->()
      DELETE oldTipo
      WITH p, tipo
      MERGE (p)-[:TEM_TIPO]->(tipo)
      WITH p
      OPTIONAL MATCH (p)-[oldFraqueza:TEM_FRAQUEZA]->()
      DELETE oldFraqueza
      WITH p
      FOREACH (fraquezaId IN $fraquezaIds |
        MERGE (fraqueza:Tipo {id: fraquezaId})
        MERGE (p)-[:TEM_FRAQUEZA]->(fraqueza)
      )
      WITH p
      OPTIONAL MATCH (p)-[oldHabilidade:TEM_HABILIDADE]->()
      DELETE oldHabilidade
      WITH p
      FOREACH (habilidade IN $habilidades |
        MERGE (h:Habilidade {nome: habilidade.nome})
        ON CREATE SET h.id = randomUUID()
        SET h.descricao = habilidade.descricao
        MERGE (p)-[:TEM_HABILIDADE]->(h)
      )
      WITH p
      OPTIONAL MATCH (p)-[oldEvolucao:EVOLUI_PARA]->()
      DELETE oldEvolucao
      WITH p
      OPTIONAL MATCH (evolucao:Pokemon {id: $evoluiParaId})
      FOREACH (_ IN CASE WHEN evolucao IS NULL THEN [] ELSE [1] END |
        MERGE (p)-[:EVOLUI_PARA]->(evolucao)
      )
      WITH p
      ${pokemonGraphReturn}
    `, {
      id: req.params.id,
      nome,
      numero: Number(numero),
      sprite_url: sprite_url || '',
      descricao: descricao || '',
      tipoId,
      fraquezaIds,
      habilidades,
      evoluiParaId: evoluiParaId || null,
    });

    if (!records.length) return res.status(404).json({ erro: 'Pokemon ou tipo nao encontrado.' });
    res.json(toNative(records[0].get('pokemon')));
  } catch (err) {
    next(err);
  }
}

async function remover(req, res, next) {
  try {
    const records = await runWrite(`
      MATCH (p:Pokemon {id: $id})
      WITH p, p.nome AS nome
      DETACH DELETE p
      RETURN nome
    `, { id: req.params.id });

    if (!records.length) return res.status(404).json({ erro: 'Pokemon nao encontrado.' });
    res.json({ mensagem: 'Pokemon removido com sucesso.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, buscar, criar, atualizar, remover };
