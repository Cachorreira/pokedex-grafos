const sequelize = require('../database');
const Usuario = require('./Usuario');
const Tipo = require('./Tipo');
const Pokemon = require('./Pokemon');
const Move = require('./Move');

// ── Relacionamentos ──────────────────────────
// Tipo 1:N Pokemon
Tipo.hasMany(Pokemon, { foreignKey: 'TipoId', as: 'pokemons' });
Pokemon.belongsTo(Tipo, { foreignKey: 'TipoId', as: 'tipo' });

// Pokemon 1:N Move
Pokemon.hasMany(Move, { foreignKey: 'PokemonId', as: 'moves' });
Move.belongsTo(Pokemon, { foreignKey: 'PokemonId', as: 'pokemon' });

module.exports = { sequelize, Usuario, Tipo, Pokemon, Move };
