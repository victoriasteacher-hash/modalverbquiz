/*
  LÓGICA DO PAINEL DA PROFESSORA (host.html)
  Depende de: firebase-config.js (db), questions.js (QUESTIONS)
*/

// ---------- Referências de tela ----------
const screens = {
  landing: document.getElementById('screen-landing'),
  lobby: document.getElementById('screen-lobby'),
  question: document.getElementById('screen-question'),
  results: document.getElementById('screen-results'),
  final: document.getElementById('screen-final'),
};
function showScreen(name) {
  Object.values(screens).forEach(el => el.style.display = 'none');
  screens[name].style.display = 'block';
}

const SHAPES = ['▲', '◆', '●', '■'];

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ---------- Estado ----------
let roomCode = null;
let currentIndex = -1;
let questionTimeout = null;
let answersListenerRef = null;
let playersListenerRef = null;
let customDuration = 20;     // segundos por pergunta, definido na sala de espera
let currentDuration = 20;    // duração usada na pergunta em andamento (para o cálculo de pontos)
let questionRevealed = true; // evita revelar a mesma pergunta duas vezes (timer + botão pular)

// ---------- Criar sala ----------
document.getElementById('btn-create-room').addEventListener('click', async () => {
  const errorEl = document.getElementById('landing-error');
  errorEl.textContent = '';
  try {
    roomCode = await createUniqueCode();
    const questionsForDb = {};
    QUESTIONS.forEach((q, i) => {
      questionsForDb[i] = { text: q.text, options: q.options, duration: q.duration };
    });
    await db.ref('rooms/' + roomCode).set({
      status: 'lobby',
      currentQuestion: -1,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      players: {},
      questions: questionsForDb
    });
    document.getElementById('lobby-code').textContent = roomCode;
    generateQrCode(roomCode);
    listenLobbyPlayers();
    showScreen('lobby');
  } catch (err) {
    console.error(err);
    errorEl.textContent = 'Não foi possível criar a sala. Confira a configuração do Firebase (firebase-config.js) e tente de novo.';
  }
});

// ---------- QR code para entrar na sala ----------
function generateQrCode(code) {
  const container = document.getElementById('qr-code');
  const wrapper = document.getElementById('qr-wrapper');
  container.innerHTML = '';

  // Monta o link de entrada a partir da própria URL desta página (host.html),
  // trocando pelo player.html com o código já preenchido.
  const basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1);
  const joinUrl = basePath + 'player.html?code=' + code;

  if (basePath.startsWith('file://')) {
    // QR code não funciona com arquivo local: só é útil quando o jogo estiver publicado online.
    wrapper.style.display = 'none';
    return;
  }

  wrapper.style.display = 'block';
  try {
    new QRCode(container, {
      text: joinUrl,
      width: 180,
      height: 180
    });
  } catch (err) {
    console.error('Não foi possível gerar o QR code:', err);
    wrapper.style.display = 'none';
  }
}

function generateCode() {
  return String(Math.floor(1000 + Math.random() * 9000));
}

async function createUniqueCode() {
  for (let i = 0; i < 10; i++) {
    const code = generateCode();
    const snap = await db.ref('rooms/' + code).once('value');
    if (!snap.exists()) return code;
  }
  return generateCode();
}

// ---------- Lobby ----------
function listenLobbyPlayers() {
  playersListenerRef = db.ref('rooms/' + roomCode + '/players');
  playersListenerRef.on('value', snap => {
    const players = snap.val() || {};
    const arr = Object.values(players);
    document.getElementById('lobby-players').innerHTML =
      arr.map(p => `<div class="player-chip">${escapeHtml(p.name)}</div>`).join('');
    document.getElementById('lobby-count').textContent = arr.length + ' aluno(s) na sala';
    document.getElementById('btn-start-game').disabled = arr.length === 0;
  });
}

document.getElementById('btn-start-game').addEventListener('click', () => {
  const raw = parseInt(document.getElementById('input-duration').value, 10);
  customDuration = (!isNaN(raw) && raw >= 5 && raw <= 300) ? raw : 20;
  if (playersListenerRef) playersListenerRef.off();
  goToQuestion(0);
});

// ---------- Pular pergunta ----------
document.getElementById('btn-skip-question').addEventListener('click', () => {
  clearTimeout(questionTimeout);
  revealAnswer(currentIndex);
});

// ---------- Pergunta ----------
async function goToQuestion(index) {
  currentIndex = index;
  if (index >= QUESTIONS.length) {
    endGame();
    return;
  }

  currentDuration = customDuration;
  questionRevealed = false;

  await db.ref('rooms/' + roomCode).update({
    currentQuestion: index,
    status: 'question',
    questionStartAt: firebase.database.ServerValue.TIMESTAMP
  });

  const q = QUESTIONS[index];
  document.getElementById('question-progress').textContent =
    `Pergunta ${index + 1} de ${QUESTIONS.length}`;
  document.getElementById('question-text').textContent = q.text;

  const grid = document.getElementById('answer-grid-host');
  grid.innerHTML = '';
  q.options.forEach((text, idx) => {
    const div = document.createElement('div');
    div.className = 'answer-btn c' + idx;
    div.innerHTML = `<span class="shape">${SHAPES[idx]}</span><span>${escapeHtml(text)}</span>`;
    grid.appendChild(div);
  });

  showScreen('question');

  // barra de tempo
  const fill = document.getElementById('timer-fill');
  fill.style.transition = 'none';
  fill.style.width = '100%';
  fill.style.backgroundColor = '#26890c';
  void fill.offsetWidth; // força reflow
  fill.style.transition = `width ${currentDuration}s linear, background-color 1s ease`;
  fill.style.width = '0%';
  setTimeout(() => { fill.style.backgroundColor = '#e21b3c'; }, (currentDuration * 1000) * 0.7);

  // contador de respostas
  answersListenerRef = db.ref('rooms/' + roomCode + '/answers/' + index);
  answersListenerRef.on('value', snap => {
    const answered = snap.val() ? Object.keys(snap.val()).length : 0;
    db.ref('rooms/' + roomCode + '/players').once('value').then(pSnap => {
      const total = pSnap.val() ? Object.keys(pSnap.val()).length : 0;
      document.getElementById('answer-count').textContent = `${answered} de ${total} responderam`;
    });
  });

  clearTimeout(questionTimeout);
  questionTimeout = setTimeout(() => revealAnswer(index), currentDuration * 1000);
}

// ---------- Revelar resposta ----------
async function revealAnswer(index) {
  if (questionRevealed) return; // já foi revelada (timer e botão "Pular" não disparam duas vezes)
  questionRevealed = true;
  clearTimeout(questionTimeout);
  if (answersListenerRef) { answersListenerRef.off(); answersListenerRef = null; }

  const q = QUESTIONS[index];
  const roomSnap = await db.ref('rooms/' + roomCode).once('value');
  const room = roomSnap.val() || {};
  const players = room.players || {};
  const answers = (room.answers && room.answers[index]) || {};
  const questionStartAt = room.questionStartAt || Date.now();
  const durationMs = currentDuration * 1000;

  const distribution = [0, 0, 0, 0];
  const updates = {};

  Object.keys(players).forEach(pid => {
    const ans = answers[pid];
    if (!ans) {
      updates['players/' + pid + '/lastPoints'] = 0;
      updates['players/' + pid + '/lastCorrect'] = false;
      return;
    }
    distribution[ans.choice] = (distribution[ans.choice] || 0) + 1;
    const isCorrect = ans.choice === q.correctIndex;
    let points = 0;
    if (isCorrect) {
      const elapsed = Math.max(0, (ans.answeredAt || questionStartAt) - questionStartAt);
      points = Math.max(500, Math.round(1000 - (elapsed / durationMs) * 500));
    }
    const currentScore = (players[pid].score || 0);
    updates['players/' + pid + '/score'] = currentScore + points;
    updates['players/' + pid + '/lastPoints'] = points;
    updates['players/' + pid + '/lastCorrect'] = isCorrect;
  });

  updates['reveals/' + index + '/correctIndex'] = q.correctIndex;
  updates['reveals/' + index + '/translation'] = q.translation || '';
  updates['status'] = 'results';
  await db.ref('rooms/' + roomCode).update(updates);

  // renderiza grid de resultado
  const grid = document.getElementById('results-grid');
  grid.innerHTML = '';
  q.options.forEach((text, idx) => {
    const div = document.createElement('div');
    const cls = idx === q.correctIndex ? 'correct' : 'wrong';
    div.className = 'answer-btn c' + idx + ' ' + cls;
    div.innerHTML = `<span class="shape">${SHAPES[idx]}</span><span>${escapeHtml(text)} — ${distribution[idx] || 0}</span>`;
    grid.appendChild(div);
  });

  // mostra a tradução (se essa pergunta tiver uma)
  document.getElementById('results-translation').textContent = q.translation ? ('Tradução: ' + q.translation) : '';

  // busca players atualizados para o ranking
  const updatedSnap = await db.ref('rooms/' + roomCode + '/players').once('value');
  renderLeaderboard(document.getElementById('results-leaderboard'), updatedSnap.val() || {}, 5);

  const btnNext = document.getElementById('btn-next-question');
  btnNext.textContent = (index + 1 >= QUESTIONS.length) ? 'Ver resultado final' : 'Próxima pergunta';
  btnNext.onclick = () => goToQuestion(index + 1);

  showScreen('results');
}

// ---------- Ranking ----------
function renderLeaderboard(container, playersObj, limit) {
  const arr = Object.entries(playersObj || {}).map(([id, p]) => ({ id, ...p }));
  arr.sort((a, b) => (b.score || 0) - (a.score || 0));
  const list = limit ? arr.slice(0, limit) : arr;
  container.innerHTML = list.map((p, i) =>
    `<li><span><span class="pos">#${i + 1}</span>${escapeHtml(p.name)}</span><span>${p.score || 0} pts</span></li>`
  ).join('');
  return arr;
}

// ---------- Fim de jogo ----------
async function endGame() {
  await db.ref('rooms/' + roomCode).update({ status: 'ended' });
  const snap = await db.ref('rooms/' + roomCode + '/players').once('value');
  const arr = renderLeaderboard(document.getElementById('final-leaderboard'), snap.val() || {});

  const podium = document.getElementById('podium');
  const top3 = arr.slice(0, 3);
  // ordem visual: 2º, 1º, 3º
  const visualOrder = [top3[1], top3[0], top3[2]];
  const visualClasses = ['second', 'first', 'third'];
  podium.innerHTML = '';
  visualOrder.forEach((p, i) => {
    if (!p) return;
    const div = document.createElement('div');
    div.className = 'step ' + visualClasses[i];
    div.innerHTML = `${escapeHtml(p.name)}<br>${p.score || 0} pts`;
    podium.appendChild(div);
  });

  showScreen('final');
}

document.getElementById('btn-new-game').addEventListener('click', () => {
  location.reload();
});
