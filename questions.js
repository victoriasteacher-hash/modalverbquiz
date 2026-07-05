/*
  BANCO DE PERGUNTAS
  -------------------
  Edite este arquivo para trocar as perguntas do jogo.

  Cada pergunta tem:
  - text: o enunciado (aparece na tela do professor)
  - options: exatamente 4 alternativas, na ordem vermelho/azul/amarelo/verde
  - correctIndex: posição da alternativa certa (0 = vermelho, 1 = azul, 2 = amarelo, 3 = verde)
  - duration: tempo em segundos para responder

  Dica: siga o método da Vic — ancore o vocabulário em um contexto real
  (uma frase, uma cena, uma música) em vez de tradução solta.
*/

const QUESTIONS = [
  {
    text: "Em 'I'm running late for class', o que significa 'running late'?",
    options: ["Correndo rápido", "Atrasado(a)", "Com sono", "Perdido(a)"],
    correctIndex: 1,
    duration: 20
  },
  {
    text: "Terry Crews diz numa entrevista: 'I had a cameo in that movie.' O que é um cameo?",
    options: [
      "O papel principal",
      "Uma participação rápida e especial",
      "A trilha sonora",
      "Um erro de gravação"
    ],
    correctIndex: 1,
    duration: 20
  },
  {
    text: "Numa série, alguém diz: 'I'm freaking out right now!' Essa pessoa está...",
    options: ["Calma", "Entediada", "Muito nervosa/assustada", "Com fome"],
    correctIndex: 2,
    duration: 20
  },
  {
    text: "'Can you give me a hand with this?' É um pedido para...",
    options: ["Um aperto de mão", "Ajuda", "Um aplauso", "Dinheiro"],
    correctIndex: 1,
    duration: 20
  },
  {
    text: "Qual frase soa mais natural para recusar um convite de forma educada?",
    options: [
      "I no can go.",
      "I can't, actually not able.",
      "I can't make it, but thanks for asking!",
      "Not possible for me."
    ],
    correctIndex: 2,
    duration: 25
  },
  {
    text: "Numa música pop, a frase é: 'I've been there before.' O tempo verbal usado indica...",
    options: [
      "Uma ação que vai acontecer",
      "Uma experiência de vida, sem tempo específico",
      "Uma ordem",
      "Uma ação acontecendo agora"
    ],
    correctIndex: 1,
    duration: 25
  },
  {
    text: "'It's raining cats and dogs!' quer dizer que está...",
    options: ["Fazendo sol", "Chovendo muito forte", "Nevando", "Ventando"],
    correctIndex: 1,
    duration: 20
  },
  {
    text: "Num podcast, o convidado diz: 'Long story short, I moved to another city.' Essa expressão serve para...",
    options: [
      "Contar tudo em detalhes",
      "Resumir uma história longa",
      "Mudar de assunto",
      "Fazer uma pergunta"
    ],
    correctIndex: 1,
    duration: 25
  }
];
