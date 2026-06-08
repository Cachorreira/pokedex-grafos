const { Move, Pokemon } = require('../models');

// GET /moves — lista todos
async function listar(req, res, next) {
  try {
    const moves = await Move.findAll({ include: [{ model: Pokemon, as: 'pokemon' }] });
    res.json(moves);
  } catch (err) { next(err); }
}

// GET /moves/:id — busca um
async function buscar(req, res, next) {
  try {
    const move = await Move.findByPk(req.params.id, {
      include: [{ model: Pokemon, as: 'pokemon' }]
    });
    if (!move) return res.status(404).json({ erro: 'Move não encontrado.' });
    res.json(move);
  } catch (err) { next(err); }
}

// POST /moves — cria
async function criar(req, res, next) {
  try {
    const { nome, poder, categoria, PokemonId } = req.body;

    const pokemonExiste = await Pokemon.findByPk(PokemonId);
    if (!pokemonExiste) return res.status(400).json({ erro: 'Pokémon não encontrado.' });

    const move = await Move.create({ nome, poder, categoria, PokemonId });
    res.status(201).json(move);
  } catch (err) { next(err); }
}

// PUT /moves/:id — atualiza
async function atualizar(req, res, next) {
  try {
    const move = await Move.findByPk(req.params.id);
    if (!move) return res.status(404).json({ erro: 'Move não encontrado.' });

    const { nome, poder, categoria, PokemonId } = req.body;
    await move.update({ nome, poder, categoria, PokemonId });
    res.json(move);
  } catch (err) { next(err); }
}

// DELETE /moves/:id — remove
async function remover(req, res, next) {
  try {
    const move = await Move.findByPk(req.params.id);
    if (!move) return res.status(404).json({ erro: 'Move não encontrado.' });

    await move.destroy();
    res.json({ mensagem: 'Move removido com sucesso.' });
  } catch (err) { next(err); }
}

module.exports = { listar, buscar, criar, atualizar, remover };
