/*
  BANCO DE PERGUNTAS
  -------------------
  Edite este arquivo para trocar as perguntas do jogo.

  Cada pergunta tem:
  - text: o enunciado (aparece na tela do professor)
  - options: exatamente 4 alternativas, na ordem vermelho/azul/amarelo/verde
  - correctIndex: posição da alternativa certa (0 = vermelho, 1 = azul, 2 = amarelo, 3 = verde)
  - duration: tempo em segundos para responder
  - translation: tradução da frase/expressão trabalhada — só aparece na tela de
    revelação, depois que todos já responderam (campo opcional; pode remover
    a linha se não quiser mostrar tradução numa pergunta específica)
*/

const QUESTIONS = [
  {
    text: "Na frase \"You must wear a seatbelt in the car.\", o modal must indica:",
    options: ["Um conselho.", "Uma obrigação.", "Uma possibilidade.", "Uma habilidade."],
    correctIndex: 1,
    duration: 20
  },
  {
    text: "Em \"She can swim very well.\", o modal can expressa:",
    options: ["Habilidade.", "Obrigação.", "Permissão.", "Conselho."],
    correctIndex: 0,
    duration: 20
  },
  {
    text: "Na frase \"You should study more for the test.\", o modal should significa:",
    options: ["É proibido.", "É obrigatório.", "É um conselho ou recomendação.", "É uma permissão."],
    correctIndex: 2,
    duration: 20
  },
  {
    text: "Em \"May I leave the classroom?\", o modal may é usado para:",
    options: ["Demonstrar habilidade.", "Fazer uma obrigação.", "Dar um conselho.", "Pedir permissão de forma educada."],
    correctIndex: 3,
    duration: 20
  },
  {
    text: "Na frase \"When I was five, I could ride a bike.\", o modal could indica:",
    options: ["Obrigação no passado.", "Habilidade no passado.", "Permissão.", "Conselho."],
    correctIndex: 1,
    duration: 20
  },
  {
    text: "Qual frase expressa um conselho?",
    options: [
      "You must finish your homework.",
      "May I use your phone?",
      "She can play the piano.",
      "You should drink more water."
    ],
    correctIndex: 3,
    duration: 20
  },
  {
    text: "Qual frase expressa uma obrigação?",
    options: [
      "I could read when I was six.",
      "May I come in?",
      "You must arrive on time.",
      "She can dance very well."
    ],
    correctIndex: 2,
    duration: 20
  },
  {
    text: "Em qual frase o modal can indica permissão?",
    options: [
      "She can cook very well.",
      "You can use my notebook.",
      "You should go home.",
      "We must study."
    ],
    correctIndex: 1,
    duration: 20
  },
  {
    text: "Qual modal completa corretamente a frase?\n\"You __ brush your teeth every day.\"",
    options: ["can", "may", "could", "should"],
    correctIndex: 3,
    duration: 25
  },
  {
    text: "Complete a frase:\n\"Students __ wear uniforms at this school.\"",
    options: ["could", "must", "may", "should"],
    correctIndex: 1,
    duration: 25
  },
  {
    text: "Qual modal completa corretamente?\n\"__ I ask you a question?\"",
    options: ["Must", "Should", "May", "Couldn't"],
    correctIndex: 2,
    duration: 25
  },
  {
    text: "Qual frase mostra uma habilidade no passado?",
    options: [
      "I can speak English.",
      "You should sleep earlier.",
      "We must be careful.",
      "I could play chess when I was a child."
    ],
    correctIndex: 3,
    duration: 20
  },
  {
    text: "O modal correto para completar a frase é:\n\"My grandmother __ speak three languages when she was younger.\"",
    options: ["can", "may", "could", "should"],
    correctIndex: 2,
    duration: 25
  },
  {
    text: "Qual frase expressa uma recomendação?",
    options: [
      "You should eat more vegetables.",
      "You must wear a helmet.",
      "May I open the window?",
      "He can run very fast."
    ],
    correctIndex: 0,
    duration: 20
  },
  {
    text: "Qual alternativa apresenta o uso correto do modal may?",
    options: [
      "You may finish your homework yesterday.",
      "She may swims every day.",
      "He may to come later.",
      "It may rain this afternoon."
    ],
    correctIndex: 3,
    duration: 25
  }
];
