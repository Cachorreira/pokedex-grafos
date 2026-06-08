// Middleware de erro global — captura qualquer erro jogado com next(err)
// Deve ser registrado por último no app.js
function erroMiddleware(err, req, res, next) {
  console.error(`[ERRO] ${err.message}`);

  const status = err.status || 500;
  const mensagem = err.message || 'Erro interno do servidor.';

  res.status(status).json({ erro: mensagem });
}

module.exports = erroMiddleware;
