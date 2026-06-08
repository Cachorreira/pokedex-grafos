// Registra método, URL, status e tempo de cada requisição
function logMiddleware(req, res, next) {
  const inicio = Date.now();

  // Intercepta o momento em que a resposta é enviada
  res.on('finish', () => {
    const duracao = Date.now() - inicio;
    const agora = new Date().toISOString();
    console.log(`[${agora}] ${req.method} ${req.originalUrl} → ${res.statusCode} (${duracao}ms)`);
  });

  next();
}

module.exports = logMiddleware;
