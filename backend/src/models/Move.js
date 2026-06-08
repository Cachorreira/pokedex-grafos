const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Move = sequelize.define('Move', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  poder: {
    type: DataTypes.INTEGER,
    allowNull: true  // alguns moves não têm poder (ex: moves de status)
  },
  categoria: {
    type: DataTypes.ENUM('fisico', 'especial', 'status'),
    allowNull: false,
    defaultValue: 'fisico'
  }
});

module.exports = Move;
