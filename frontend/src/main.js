const API_URL = 'http://localhost:3000';

const state = {
  token: localStorage.getItem('pokedexToken') || '',
  user: JSON.parse(localStorage.getItem('pokedexUser') || 'null'),
  pokemons: [],
  tipos: [],
  graph: { nodes: [], edges: [] },
  favoritos: [],
  equipes: [],
  selectedId: null,
};

const els = {
  apiStatus: document.querySelector('#apiStatus'),
  authStatus: document.querySelector('#authStatus'),
  counter: document.querySelector('#counter'),
  graphCounter: document.querySelector('#graphCounter'),
  grid: document.querySelector('#pokemonGrid'),
  detail: document.querySelector('#detailPanel'),
  graphList: document.querySelector('#graphList'),
  search: document.querySelector('#searchInput'),
  typeFilter: document.querySelector('#typeFilter'),
  refresh: document.querySelector('#refreshButton'),
  authForm: document.querySelector('#authForm'),
  registerButton: document.querySelector('#registerButton'),
  pokemonForm: document.querySelector('#pokemonForm'),
  pokemonTypeSelect: document.querySelector('#pokemonForm select[name="tipoId"]'),
  pokemonWeaknessSelect: document.querySelector('#pokemonForm select[name="fraquezaIds"]'),
  evolutionSelect: document.querySelector('#pokemonForm select[name="evoluiParaId"]'),
  teamForm: document.querySelector('#teamForm'),
  teamMembersSelect: document.querySelector('#teamForm select[name="pokemonIds"]'),
  favoritesList: document.querySelector('#favoritesList'),
  teamsList: document.querySelector('#teamsList'),
  message: document.querySelector('#messageArea'),
};

async function api(path, options = {}) {
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  if (state.token) headers.Authorization = `Bearer ${state.token}`;

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const details = payload.erro || payload.erros?.join(' ') || 'Falha na requisicao.';
    throw new Error(details);
  }

  return payload;
}

function setMessage(text, type = 'info') {
  els.message.textContent = text;
  els.message.dataset.type = type;
}

function spriteFor(pokemon) {
  return pokemon.sprite_url || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.numero}.png`;
}

function normalizePokemon(pokemon) {
  return {
    ...pokemon,
    tipo: pokemon.tipo || { nome: 'Sem tipo', cor: '#7c8a97' },
    fraquezas: pokemon.fraquezas || [],
    habilidades: pokemon.habilidades || [],
    sprite: spriteFor(pokemon),
  };
}

function filteredPokemons() {
  const query = els.search.value.trim().toLowerCase();
  const typeId = els.typeFilter.value;

  return state.pokemons.map(normalizePokemon).filter((pokemon) => {
    const matchesQuery = !query || pokemon.nome.toLowerCase().includes(query) || String(pokemon.numero).includes(query);
    const matchesType = !typeId || pokemon.tipo?.id === typeId;
    return matchesQuery && matchesType;
  });
}

function renderSelects() {
  const filterValue = els.typeFilter.value;
  els.typeFilter.innerHTML = '<option value="">Todos</option>';
  els.pokemonTypeSelect.innerHTML = '<option value="">Selecione</option>';
  els.pokemonWeaknessSelect.innerHTML = '';
  els.evolutionSelect.innerHTML = '<option value="">Nenhuma</option>';
  els.teamMembersSelect.innerHTML = '';

  for (const tipo of state.tipos) {
    els.typeFilter.add(new Option(tipo.nome, tipo.id));
    els.pokemonTypeSelect.add(new Option(tipo.nome, tipo.id));
    els.pokemonWeaknessSelect.add(new Option(tipo.nome, tipo.id));
  }

  for (const pokemon of state.pokemons) {
    const label = `#${String(pokemon.numero).padStart(3, '0')} ${pokemon.nome}`;
    els.evolutionSelect.add(new Option(label, pokemon.id));
    els.teamMembersSelect.add(new Option(label, pokemon.id));
  }

  els.typeFilter.value = filterValue;
}

function renderGrid() {
  const pokemons = filteredPokemons();
  els.counter.textContent = `${pokemons.length} Pokemon`;

  if (!pokemons.length) {
    els.grid.innerHTML = '<div class="empty-state"><h3>Nenhum Pokemon encontrado</h3><p>Cadastre novos nos ou ajuste os filtros.</p></div>';
    return;
  }

  els.grid.innerHTML = pokemons.map((pokemon) => `
    <button class="pokemon-card ${state.selectedId === pokemon.id ? 'selected' : ''}" data-id="${pokemon.id}" type="button">
      <span class="pokemon-number">#${String(pokemon.numero).padStart(3, '0')}</span>
      <img src="${pokemon.sprite}" alt="${pokemon.nome}" loading="lazy" />
      <strong>${pokemon.nome}</strong>
      <span class="type-chip" style="--type-color: ${pokemon.tipo.cor}">${pokemon.tipo.nome}</span>
    </button>
  `).join('');
}

function chipList(items, emptyText) {
  if (!items?.length) return `<span class="muted">${emptyText}</span>`;
  return items.map((item) => `<span class="relation-chip">${item.nome}</span>`).join('');
}

function renderDetail() {
  const selected = state.pokemons.find((pokemon) => pokemon.id === state.selectedId);

  if (!selected) {
    els.detail.innerHTML = '<div class="detail-empty"><span class="pokeball-mark"></span><h2>Escolha um Pokemon</h2><p>As relacoes do grafo aparecem aqui.</p></div>';
    return;
  }

  const pokemon = normalizePokemon(selected);
  els.detail.innerHTML = `
    <div class="detail-card" style="--accent: ${pokemon.tipo.cor}">
      <span class="pokemon-number">#${String(pokemon.numero).padStart(3, '0')}</span>
      <img src="${pokemon.sprite}" alt="${pokemon.nome}" />
      <h2>${pokemon.nome}</h2>
      <span class="type-chip" style="--type-color: ${pokemon.tipo.cor}">${pokemon.tipo.nome}</span>
      <p>${pokemon.descricao || 'Sem descricao cadastrada.'}</p>
      <div class="relation-block">
        <strong>Evolucao</strong>
        <span>${pokemon.evoluiPara ? `${pokemon.nome} evolui para ${pokemon.evoluiPara.nome}` : 'Sem evolucao cadastrada'}</span>
      </div>
      <div class="relation-block">
        <strong>Fraquezas</strong>
        <div>${chipList(pokemon.fraquezas, 'Nenhuma fraqueza cadastrada')}</div>
      </div>
      <div class="relation-block">
        <strong>Habilidades</strong>
        <div>${chipList(pokemon.habilidades, 'Nenhuma habilidade cadastrada')}</div>
      </div>
      <button class="favorite-button" data-favorite="${pokemon.id}" type="button">Favoritar</button>
    </div>
  `;
}

function renderGraph() {
  els.graphCounter.textContent = `${state.graph.edges.length} relacoes`;
  els.graphList.innerHTML = state.graph.edges.slice(0, 18).map((edge) => {
    const source = state.graph.nodes.find((node) => node.id === edge.source)?.nome || edge.source;
    const target = state.graph.nodes.find((node) => node.id === edge.target)?.nome || edge.target;
    return `<span><strong>${source}</strong> ${edge.type.replaceAll('_', ' ').toLowerCase()} <strong>${target}</strong></span>`;
  }).join('') || '<span class="muted">Sem relacoes carregadas.</span>';
}

function renderAuth() {
  els.authStatus.textContent = state.user ? `Logado: ${state.user.nome || state.user.email}` : 'Visitante';
}

function renderTrainerData() {
  els.favoritesList.innerHTML = state.favoritos.map((pokemon) => `<span>${pokemon.nome}</span>`).join('') || '<span class="muted">Entre e favorite Pokemon.</span>';
  els.teamsList.innerHTML = state.equipes.map((equipe) => `
    <span><strong>${equipe.nome}</strong>: ${(equipe.pokemons || []).map((p) => p.nome).join(', ') || 'sem membros'}</span>
  `).join('') || '<span class="muted">Nenhuma equipe criada.</span>';
}

function renderAll() {
  renderSelects();
  renderGrid();
  renderDetail();
  renderGraph();
  renderAuth();
  renderTrainerData();
}

async function loadProtectedData() {
  if (!state.token) {
    state.favoritos = [];
    state.equipes = [];
    return;
  }
  try {
    const [favoritos, equipes] = await Promise.all([
      api('/usuarios/favoritos'),
      api('/usuarios/equipes'),
    ]);
    state.favoritos = favoritos;
    state.equipes = equipes;
  } catch (error) {
    state.token = '';
    state.user = null;
    state.favoritos = [];
    state.equipes = [];
    localStorage.removeItem('pokedexToken');
    localStorage.removeItem('pokedexUser');
    setMessage('Sua sessao expirou. Faca login novamente para ver favoritos e equipes.', 'error');
  }
}

async function loadData() {
  els.apiStatus.textContent = 'Sincronizando';
  els.apiStatus.dataset.online = 'pending';

  const [tipos, pokemons, graph] = await Promise.all([
    api('/tipos'),
    api('/pokemons'),
    api('/graph'),
  ]);

  state.tipos = tipos;
  state.pokemons = pokemons;
  state.graph = graph;
  if (!state.selectedId && pokemons[0]) state.selectedId = pokemons[0].id;
  await loadProtectedData();

  els.apiStatus.textContent = 'API online';
  els.apiStatus.dataset.online = 'true';
  renderAll();
}

async function handleAuth(event, mode) {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(els.authForm));
  const payload = { email: data.email, senha: data.senha };
  if (mode === 'cadastro') payload.nome = data.nome || 'Treinador';

  const result = await api(mode === 'cadastro' ? '/auth/cadastro' : '/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  if (mode === 'login') {
    state.token = result.token;
    state.user = result.usuario;
    localStorage.setItem('pokedexToken', state.token);
    localStorage.setItem('pokedexUser', JSON.stringify(state.user));
    await loadProtectedData();
    renderAll();
  }

  setMessage(result.mensagem || 'Tudo certo.', 'success');
}

els.grid.addEventListener('click', (event) => {
  const card = event.target.closest('.pokemon-card');
  if (!card) return;
  state.selectedId = card.dataset.id;
  renderGrid();
  renderDetail();
});

els.detail.addEventListener('click', async (event) => {
  const button = event.target.closest('[data-favorite]');
  if (!button) return;
  if (!state.token) {
    setMessage('Faca login antes de favoritar Pokemon.', 'error');
    return;
  }
  try {
    await api(`/usuarios/favoritos/${button.dataset.favorite}`, { method: 'POST', body: '{}' });
    setMessage('Pokemon favoritado.', 'success');
    await loadData();
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

els.search.addEventListener('input', renderGrid);
els.typeFilter.addEventListener('change', renderGrid);
els.refresh.addEventListener('click', () => loadData().catch((error) => setMessage(error.message, 'error')));
els.authForm.addEventListener('submit', (event) => handleAuth(event, 'login').catch((error) => setMessage(error.message, 'error')));
els.registerButton.addEventListener('click', (event) => handleAuth(event, 'cadastro').catch((error) => setMessage(error.message, 'error')));

els.pokemonForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(els.pokemonForm);
  const habilidadesText = String(form.get('habilidades') || '').trim();
  const habilidades = habilidadesText
    ? habilidadesText.split(',').map((item) => {
        const [nome, descricao = ''] = item.split(':');
        return { nome: nome.trim(), descricao: descricao.trim() };
      }).filter((item) => item.nome)
    : [];

  await api('/pokemons', {
    method: 'POST',
    body: JSON.stringify({
      nome: form.get('nome'),
      numero: Number(form.get('numero')),
      tipoId: form.get('tipoId'),
      fraquezaIds: form.getAll('fraquezaIds'),
      evoluiParaId: form.get('evoluiParaId'),
      sprite_url: form.get('sprite_url'),
      descricao: form.get('descricao'),
      habilidades,
    }),
  });
  els.pokemonForm.reset();
  setMessage('Pokemon adicionado ao grafo.', 'success');
  await loadData();
});

els.teamForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!state.token) {
    setMessage('Faca login antes de criar equipes.', 'error');
    return;
  }
  const form = new FormData(els.teamForm);
  try {
    await api('/usuarios/equipes', {
      method: 'POST',
      body: JSON.stringify({ nome: form.get('nome'), pokemonIds: form.getAll('pokemonIds') }),
    });
    els.teamForm.reset();
    setMessage('Equipe criada.', 'success');
    await loadData();
  } catch (error) {
    setMessage(error.message, 'error');
  }
});

loadData().catch((error) => {
  els.apiStatus.textContent = 'API offline';
  els.apiStatus.dataset.online = 'false';
  setMessage(error.message, 'error');
  renderAll();
});
