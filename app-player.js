/*
  LÓGICA DA TELA DO ALUNO (player.html)
  Depende de: firebase-config.js (db)
*/

const screens = {
  join: document.getElementById('screen-join'),
  waiting: document.getElementById('screen-waiting'),
  question: document.getElementById('screen-question'),
  results: document.getElementById('screen-results'),
  final: document.getElementById('screen-final'),
};
function showScreen(name) {
  Object.values(screens).forEach(el => el.style.display = 'none');
  screens[name].style.display = 'block';
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let roomCode = null;
let playerId = null;
let playerName = null;
let lastQuestionIndex = -1;
let hasAnswered = false;

// ---------- Preenche o código automaticamente se veio de um QR code ----------
(function preencherCodigoDaUrl() {
  const params = new URLSearchParams(window.location.search);
  const codeFromUrl = params.get('code');
  if (codeFromUrl) {
    document.getElementById('input-code').value = codeFromUrl;
    document.getElementById('input-name').focus();
  }
})();

// ---------- Entrar na sala ----------
document.getElementById('btn-join').addEventListener('click', async () => {
  const errorEl = document.getElementById('join-error');
  errorEl.textContent = '';
  const code = document.getElementById('input-code').value.trim();
  const name = document.getElementById('input-name').value.trim();

  if (!/^\d{4}$/.test(code)) {
    errorEl.textContent = 'Digite o código de 4 dígitos.';
    return;
  }
  if (!name) {
    errorEl.textContent = 'Digite seu nome.';
    return;
  }

  try {
    const snap = await db.ref('rooms/' + code).once('value');
    if (!snap.exists()) {
      errorEl.textContent = 'Sala não encontrada. Confira o código.';
      return;
    }
    const room = snap.val();
    if (room.status !== 'lobby') {
      errorEl.textContent = 'O jogo já começou. Peça para a professora criar uma nova sala.';
      return;
    }

    roomCode = code;
    playerName = name;
    playerId = 'p_' + Math.random().toString(36).slice(2, 10);

    await db.ref('rooms/' + roomCode + '/players/' + playerId).set({
      name: playerName,
      score: 0,
      joinedAt: firebase.database.ServerValue.TIMESTAMP
    });

    document.getElementById('waiting-name').textContent = playerName;
    attachRoomListener();
    showScreen('waiting');
  } catch (err) {
    console.error(err);
    errorEl.textContent = 'Erro ao entrar na sala. Confira a configuração do Firebase (firebase-config.js).';
  }
});

// ---------- Escuta o estado da sala ----------
function attachRoomListener() {
  db.ref('rooms/' + roomCode).on('value', snap => {
    const room = snap.val();
    if (!room) return;
    const status = room.status;
    const idx = room.currentQuestion;

    if (status === 'lobby') {
      showScreen('waiting');
    } else if (status === 'question') {
      if (idx !== lastQuestionIndex) {
        lastQuestionIndex = idx;
        hasAnswered = false;
        resetAnswerButtons();
      }
      showScreen('question');
    } else if (status === 'results') {
      showResultsForIndex(idx, room);
    } else if (status === 'ended') {
      showFinal(room);
    }
  });
}

// ---------- Responder ----------
function resetAnswerButtons() {
  document.querySelectorAll('.player-answer-btn').forEach(b => b.disabled = false);
  document.getElementById('question-status').textContent = '';
}

document.querySelectorAll('.player-answer-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (hasAnswered) return;
    hasAnswered = true;
    const choice = parseInt(btn.dataset.choice, 10);
    db.ref('rooms/' + roomCode + '/answers/' + lastQuestionIndex + '/' + playerId).set({
      choice: choice,
      answeredAt: firebase.database.ServerValue.TIMESTAMP
    });
    document.querySelectorAll('.player-answer-btn').forEach(b => b.disabled = true);
    document.getElementById('question-status').textContent = 'Resposta enviada! Aguarde os outros colegas...';
  });
});

// ---------- Resultado da pergunta ----------
function showResultsForIndex(idx, room) {
  const player = (room.players && room.players[playerId]) || {};
  const feedbackEl = document.getElementById('results-feedback');
  const pointsEl = document.getElementById('results-points');

  if (player.lastCorrect) {
    feedbackEl.innerHTML = '<div class="feedback-correct">✅ Certa resposta!</div>';
    pointsEl.textContent = `+${player.lastPoints || 0} pontos`;
  } else {
    feedbackEl.innerHTML = '<div class="feedback-wrong">❌ Não foi dessa vez</div>';
    pointsEl.textContent = hasAnswered ? '+0 pontos' : 'Você não respondeu a tempo';
  }

  document.getElementById('results-total-score').textContent = player.score || 0;

  const translation = room.reveals && room.reveals[idx] ? room.reveals[idx].translation : '';
  document.getElementById('results-translation').textContent = translation ? ('Tradução: ' + translation) : '';

  const arr = Object.entries(room.players || {}).map(([id, p]) => ({ id, ...p }));
  arr.sort((a, b) => (b.score || 0) - (a.score || 0));
  const rank = arr.findIndex(p => p.id === playerId) + 1;
  document.getElementById('results-rank').textContent = rank ? `Você está em #${rank} de ${arr.length}` : '';

  showScreen('results');
}

// ---------- Fim de jogo ----------
function showFinal(room) {
  const arr = Object.entries(room.players || {}).map(([id, p]) => ({ id, ...p }));
  arr.sort((a, b) => (b.score || 0) - (a.score || 0));
  const rank = arr.findIndex(p => p.id === playerId) + 1;
  const me = arr[rank - 1];

  document.getElementById('final-rank-text').textContent =
    `Você terminou em #${rank} de ${arr.length} com ${me ? (me.score || 0) : 0} pontos.`;

  const top3 = arr.slice(0, 3);
  document.getElementById('final-leaderboard').innerHTML = top3.map((p, i) =>
    `<li class="${p.id === playerId ? 'me' : ''}"><span><span class="pos">#${i + 1}</span>${escapeHtml(p.name)}</span><span>${p.score || 0} pts</span></li>`
  ).join('');

  showScreen('final');
}
