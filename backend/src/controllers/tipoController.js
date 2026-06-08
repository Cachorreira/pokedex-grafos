const { runRead, runWrite, toNative } = require('../database');

async function listar(req, res, next) {
  try {
    const records = await runRead('MATCH (t:Tipo) RETURN t ORDER BY t.nome');
    res.json(records.map((record) => toNative(record.get('t'))));
  } catch (err) {
    next(err);
  }
}

async function criar(req, res, next) {
  try {
    const { nome, cor } = req.body;
    const records = await runWrite(`
      MERGE (t:Tipo {nome: $nome})
      ON CREATE SET t.id = randomUUID()
      SET t.cor = $cor
      RETURN t
    `, { nome, cor: cor || '#999999' });

    res.status(201).json(toNative(records[0].get('t')));
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, criar };
