const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Tipo = sequelize.define('Tipo', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  cor: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '#999999'
  }
});

module.exports = Tipo;
