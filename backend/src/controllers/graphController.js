const { runRead, toNative } = require('../database');

async function resumo(req, res, next) {
  try {
    const records = await runRead(`
      MATCH (p:Pokemon)
      OPTIONAL MATCH (p)-[r]->(n)
      RETURN collect(DISTINCT p {.*, label:'Pokemon'}) + collect(DISTINCT n {.*, label: labels(n)[0]}) AS nodes,
             collect(DISTINCT {source: p.id, target: n.id, type: type(r)}) AS edges
    `);

    res.json({
      nodes: records[0].get('nodes').map(toNative).filter(Boolean),
      edges: records[0].get('edges').map(toNative).filter((edge) => edge.target),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { resumo };
