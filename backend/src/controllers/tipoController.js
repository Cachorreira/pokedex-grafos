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

async function buscar(req, res, next) {
  try {
    const records = await runRead('MATCH (t:Tipo {id: $id}) RETURN t', { id: req.params.id });
    if (!records.length) return res.status(404).json({ erro: 'Tipo nao encontrado.' });
    res.json(toNative(records[0].get('t')));
  } catch (err) {
    next(err);
  }
}

async function atualizar(req, res, next) {
  try {
    const { nome, cor } = req.body;
    const records = await runWrite(`
      MATCH (t:Tipo {id: $id})
      SET t.nome = $nome,
          t.cor = $cor,
          t.updatedAt = datetime()
      RETURN t
    `, { id: req.params.id, nome, cor: cor || '#999999' });

    if (!records.length) return res.status(404).json({ erro: 'Tipo nao encontrado.' });
    res.json(toNative(records[0].get('t')));
  } catch (err) {
    next(err);
  }
}

async function remover(req, res, next) {
  try {
    const records = await runWrite(`
      MATCH (t:Tipo {id: $id})
      WITH t, t.nome AS nome
      DETACH DELETE t
      RETURN nome
    `, { id: req.params.id });

    if (!records.length) return res.status(404).json({ erro: 'Tipo nao encontrado.' });
    res.json({ mensagem: 'Tipo removido com sucesso.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { listar, buscar, criar, atualizar, remover };
