const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Pokemon = sequelize.define('Pokemon', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numero: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  sprite_url: {
    type: DataTypes.STRING,
    allowNull: true
  },
  descricao: {
    type: DataTypes.TEXT,
    allowNull: true
  }
});

module.exports = Pokemon;
