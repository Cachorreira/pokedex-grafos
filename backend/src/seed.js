const bcrypt = require('bcryptjs');
const { runWrite } = require('./database');

async function ensureConstraints() {
  await runWrite('CREATE CONSTRAINT usuario_email IF NOT EXISTS FOR (u:Usuario) REQUIRE u.email IS UNIQUE');
  await runWrite('CREATE CONSTRAINT pokemon_id IF NOT EXISTS FOR (p:Pokemon) REQUIRE p.id IS UNIQUE');
  await runWrite('CREATE CONSTRAINT pokemon_numero IF NOT EXISTS FOR (p:Pokemon) REQUIRE p.numero IS UNIQUE');
  await runWrite('CREATE CONSTRAINT tipo_id IF NOT EXISTS FOR (t:Tipo) REQUIRE t.id IS UNIQUE');
  await runWrite('CREATE CONSTRAINT habilidade_id IF NOT EXISTS FOR (h:Habilidade) REQUIRE h.id IS UNIQUE');
}

async function seedGraph() {
  const senhaHash = await bcrypt.hash('pokedex123', 10);

  await runWrite(`
    MERGE (u:Usuario {email: 'admin@pokedex.local'})
    SET u.id = coalesce(u.id, 'user-admin'),
        u.nome = 'Admin Pokedex',
        u.senhaHash = coalesce(u.senhaHash, $senhaHash),
        u.updatedAt = datetime()
  `, { senhaHash });

  await runWrite(`
    UNWIND [
      {id:'tipo-grama', nome:'Grama', cor:'#7ac74c'},
      {id:'tipo-fogo', nome:'Fogo', cor:'#ee8130'},
      {id:'tipo-agua', nome:'Agua', cor:'#6390f0'},
      {id:'tipo-eletrico', nome:'Eletrico', cor:'#f7d02c'},
      {id:'tipo-voador', nome:'Voador', cor:'#a98ff3'}
    ] AS item
    MERGE (t:Tipo {id: item.id})
    SET t.nome = item.nome, t.cor = item.cor
  `);

  await runWrite(`
    UNWIND [
      {id:'hab-overgrow', nome:'Overgrow', descricao:'Fortalece golpes de Grama em momentos criticos.'},
      {id:'hab-blaze', nome:'Blaze', descricao:'Fortalece golpes de Fogo em momentos criticos.'},
      {id:'hab-torrent', nome:'Torrent', descricao:'Fortalece golpes de Agua em momentos criticos.'},
      {id:'hab-static', nome:'Static', descricao:'Pode paralisar quem encosta no Pokemon.'},
      {id:'hab-solar-power', nome:'Solar Power', descricao:'Aumenta ataque especial sob sol forte.'}
    ] AS item
    MERGE (h:Habilidade {id: item.id})
    SET h.nome = item.nome, h.descricao = item.descricao
  `);

  await runWrite(`
    UNWIND [
      {id:'poke-001', numero:1, nome:'Bulbasaur', sprite_url:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png', descricao:'Pokemon semente com uma planta nas costas desde o nascimento.', tipo:'tipo-grama', fraquezas:['tipo-fogo'], habilidades:['hab-overgrow']},
      {id:'poke-002', numero:2, nome:'Ivysaur', sprite_url:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png', descricao:'A planta em suas costas cresce enquanto ele absorve energia.', tipo:'tipo-grama', fraquezas:['tipo-fogo'], habilidades:['hab-overgrow']},
      {id:'poke-004', numero:4, nome:'Charmander', sprite_url:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png', descricao:'A chama em sua cauda mostra sua energia e vitalidade.', tipo:'tipo-fogo', fraquezas:['tipo-agua'], habilidades:['hab-blaze']},
      {id:'poke-005', numero:5, nome:'Charmeleon', sprite_url:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/5.png', descricao:'Tem temperamento intenso e golpes de fogo poderosos.', tipo:'tipo-fogo', fraquezas:['tipo-agua'], habilidades:['hab-blaze']},
      {id:'poke-007', numero:7, nome:'Squirtle', sprite_url:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png', descricao:'Ataca com jatos de agua e se protege dentro do casco.', tipo:'tipo-agua', fraquezas:['tipo-eletrico','tipo-grama'], habilidades:['hab-torrent']},
      {id:'poke-025', numero:25, nome:'Pikachu', sprite_url:'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png', descricao:'Armazena eletricidade nas bochechas e solta descargas poderosas.', tipo:'tipo-eletrico', fraquezas:['tipo-grama'], habilidades:['hab-static']}
    ] AS item
    MERGE (p:Pokemon {id: item.id})
    SET p.numero = item.numero,
        p.nome = item.nome,
        p.sprite_url = item.sprite_url,
        p.descricao = item.descricao
    WITH p, item
    MATCH (tipo:Tipo {id: item.tipo})
    MERGE (p)-[:TEM_TIPO]->(tipo)
    WITH p, item
    UNWIND item.fraquezas AS fraquezaId
    MATCH (fraqueza:Tipo {id: fraquezaId})
    MERGE (p)-[:TEM_FRAQUEZA]->(fraqueza)
    WITH p, item
    UNWIND item.habilidades AS habilidadeId
    MATCH (h:Habilidade {id: habilidadeId})
    MERGE (p)-[:TEM_HABILIDADE]->(h)
  `);

  await runWrite(`
    MATCH (bulba:Pokemon {id:'poke-001'}), (ivy:Pokemon {id:'poke-002'})
    MERGE (bulba)-[:EVOLUI_PARA]->(ivy)
    WITH ivy
    MATCH (char:Pokemon {id:'poke-004'}), (charmeleon:Pokemon {id:'poke-005'})
    MERGE (char)-[:EVOLUI_PARA]->(charmeleon)
  `);
}

async function initializeDatabase() {
  await ensureConstraints();
  await seedGraph();
}

module.exports = { initializeDatabase };
