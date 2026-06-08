const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const bcrypt = require('bcryptjs');

const Usuario = sequelize.define('Usuario', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  senha: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  // Hook: antes de salvar, faz o hash da senha automaticamente
  hooks: {
    beforeCreate: async (usuario) => {
      usuario.senha = await bcrypt.hash(usuario.senha, 10);
    },
    beforeUpdate: async (usuario) => {
      if (usuario.changed('senha')) {
        usuario.senha = await bcrypt.hash(usuario.senha, 10);
      }
    }
  }
});

// Método para comparar senha no login
Usuario.prototype.verificarSenha = function(senha) {
  return bcrypt.compare(senha, this.senha);
};

module.exports = Usuario;
