function validarPokemon(req, res, next) {
  const { nome, numero, tipoId } = req.body;
  const erros = [];

  if (!nome || nome.trim() === '') erros.push('Campo "nome" e obrigatorio.');
  if (!numero || Number.isNaN(Number(numero))) erros.push('Campo "numero" deve ser numerico.');
  if (!tipoId) erros.push('Campo "tipoId" e obrigatorio.');

  if (erros.length) return res.status(400).json({ erros });
  next();
}

function validarUsuario(req, res, next) {
  const { email, senha } = req.body;
  const erros = [];

  if (!email || email.trim() === '') erros.push('Campo "email" e obrigatorio.');
  if (!senha || senha.length < 6) erros.push('Campo "senha" deve ter pelo menos 6 caracteres.');

  if (erros.length) return res.status(400).json({ erros });
  next();
}

module.exports = { validarPokemon, validarUsuario };
