const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { runRead, runWrite, toNative } = require('../database');

function publicUser(usuario) {
  return { id: usuario.id, nome: usuario.nome, email: usuario.email };
}

async function cadastro(req, res, next) {
  try {
    const { nome, email, senha } = req.body;
    const existentes = await runRead('MATCH (u:Usuario {email: $email}) RETURN u LIMIT 1', { email });
    if (existentes.length) return res.status(409).json({ erro: 'E-mail ja cadastrado.' });

    const senhaHash = await bcrypt.hash(senha, 10);

    const records = await runWrite(`
      CREATE (u:Usuario {
        id: randomUUID(),
        nome: $nome,
        email: $email,
        senhaHash: $senhaHash,
        createdAt: datetime()
      })
      RETURN u
    `, { nome: nome || 'Treinador', email, senhaHash });

    const usuario = toNative(records[0].get('u'));
    return res.status(201).json({
      mensagem: 'Usuario criado com sucesso.',
      usuario: publicUser(usuario),
    });
  } catch (err) {
    next(err);
  }
}

async function login(req, res, next) {
  try {
    const { email, senha } = req.body;
    const records = await runRead('MATCH (u:Usuario {email: $email}) RETURN u LIMIT 1', { email });

    if (!records.length) return res.status(401).json({ erro: 'E-mail ou senha invalidos.' });

    const usuario = toNative(records[0].get('u'));
    const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash || '');
    if (!senhaCorreta) return res.status(401).json({ erro: 'E-mail ou senha invalidos.' });

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.json({
      mensagem: 'Login realizado com sucesso.',
      token,
      usuario: publicUser(usuario),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { cadastro, login };
