const neo4j = require('neo4j-driver');
require('dotenv').config();

const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'pokedex123'
  )
);

function toNative(value) {
  if (neo4j.isInt(value)) return value.toNumber();
  if (Array.isArray(value)) return value.map(toNative);
  if (value && typeof value === 'object') {
    if (value.properties) return toNative(value.properties);
    return Object.fromEntries(
      Object.entries(value).map(([key, entry]) => [key, toNative(entry)])
    );
  }
  return value;
}

async function runRead(cypher, params = {}) {
  const session = driver.session();
  try {
    const result = await session.executeRead((tx) => tx.run(cypher, params));
    return result.records;
  } finally {
    await session.close();
  }
}

async function runWrite(cypher, params = {}) {
  const session = driver.session();
  try {
    const result = await session.executeWrite((tx) => tx.run(cypher, params));
    return result.records;
  } finally {
    await session.close();
  }
}

async function verifyConnection() {
  await driver.verifyConnectivity();
}

module.exports = { driver, runRead, runWrite, toNative, verifyConnection };
