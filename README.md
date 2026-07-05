# Quiz ao Vivo — jogo multiplayer tipo Kahoot

Jogo de perguntas em tempo real: você (professora) cria uma sala, os alunos entram pelo celular ou computador com um código de 4 dígitos, e todo mundo joga ao mesmo tempo. Pontuação ao vivo, ranking e pódio no final — igual ao Kahoot, só que é seu, gratuito e editável.

## Como funciona por trás

Não existe um servidor seu rodando o tempo todo. Quem sincroniza tudo em tempo real (quem entrou na sala, quem respondeu, a pontuação) é o **Firebase Realtime Database**, um banco de dados do Google com plano gratuito bem generoso — dá pra usar em sala de aula sem pagar nada. Os arquivos aqui são só HTML/CSS/JavaScript, sem instalação.

## Arquivos incluídos

| Arquivo | Para que serve |
|---|---|
| `index.html` | Tela inicial (escolher "professora" ou "aluno") |
| `host.html` + `app-host.js` | Painel da professora — compartilhado na tela da videochamada |
| `player.html` + `app-player.js` | Tela do aluno — abre no celular ou notebook de cada um |
| `questions.js` | **Banco de perguntas — edite aqui para trocar o conteúdo** |
| `firebase-config.js` | **Suas credenciais do Firebase — precisa preencher** |
| `style.css` | Visual do jogo |

---

## Passo a passo da configuração (uns 10-15 minutos, só na primeira vez)

### 1. Criar o projeto no Firebase

1. Acesse [console.firebase.google.com](https://console.firebase.google.com) e entre com sua conta Google.
2. Clique em **Adicionar projeto**, dê um nome (ex: `quiz-ingles-vic`) e siga o assistente (pode desativar o Google Analytics, não é necessário).
3. Espere o projeto ser criado.

### 2. Ativar o Realtime Database

1. No menu lateral, vá em **Databases & Storage > Realtime Database**.
2. Clique em **Criar banco de dados**.
3. Escolha a localização (qualquer uma serve) e comece **em modo de teste**.
4. Depois de criado, vá na aba **Regras** e substitua pelo conteúdo abaixo, depois clique em **Publicar**:

```json
{
  "rules": {
    "rooms": {
      "$roomCode": {
        ".read": true,
        ".write": true
      }
    }
  }
}
```

> Isso deixa a leitura/escrita aberta apenas dentro de `/rooms`, sem exigir login. É suficiente para uso em sala de aula, mas qualquer pessoa com o link técnico do banco poderia teoricamente ler os dados da sala — não é o ideal para dados sensíveis, só para o jogo mesmo.

### 3. Pegar as credenciais do app

1. Clique no ícone de engrenagem ⚙️ ao lado de "Visão geral do projeto" > **Configurações do projeto** > aba **Geral**.
2. Role até **Seus apps** e clique no ícone **`</>`** (Web) para registrar um app.
3. Dê um apelido (ex: `quiz-web`) e clique em **Registrar app**. Não precisa do Firebase Hosting nessa etapa.
4. Copie o objeto `firebaseConfig` que aparece.
5. Abra o arquivo `firebase-config.js` (clique com o botão direito nele > Abrir com > Bloco de Notas) e cole os valores no lugar de `COLE_AQUI...`. Salve com Ctrl+S.

### 4. Colocar o jogo online

Os alunos precisam abrir os arquivos por um link (não funciona bem abrindo o arquivo direto do computador). O jeito mais simples e gratuito é o **GitHub Pages**:

1. Crie uma conta gratuita em [github.com](https://github.com) (se ainda não tiver).
2. Clique em **New repository**, dê um nome (ex: `quiz-ao-vivo`) e marque como **Public**. Crie.
3. Dentro do repositório, clique em **Add file > Upload files** e arraste todos os arquivos desta pasta (`index.html`, `host.html`, `player.html`, os `.js` e o `.css`).
4. Clique em **Commit changes**.
5. Vá em **Settings > Pages**, em "Branch" escolha `main` e pasta `/ (root)`, salve.
6. Espere 1-2 minutos. Seu jogo estará em algo como `https://seu-usuario.github.io/quiz-ao-vivo/`.

Depois disso, seus links fixos serão:
- **Você (professora):** `https://seu-usuario.github.io/quiz-ao-vivo/host.html`
- **Alunos:** `https://seu-usuario.github.io/quiz-ao-vivo/player.html`

Sempre que editar `questions.js` (ou qualquer arquivo), suba a versão nova pelo mesmo caminho (**Add file > Upload files**, substituindo o arquivo).

---

## Como jogar

1. Você abre `host.html` e compartilha essa tela na videochamada (ou projeta em sala física).
2. Clica em **Criar sala** — aparece um código de 4 dígitos e um **QR code**.
3. Os alunos entram de dois jeitos: abrindo `player.html` e digitando o código + nome, **ou** apontando a câmera do celular para o QR code (o código já vem preenchido, só falta digitar o nome).
4. Antes de começar, você pode ajustar o **tempo por pergunta** (campo na própria tela de espera, padrão 20 segundos).
5. Quando todos entrarem, clique em **Iniciar jogo**.
6. Cada pergunta aparece na SUA tela (texto + alternativas). Os alunos só veem 4 botões coloridos (▲ ◆ ● ■) no aparelho deles — como no Kahoot, é preciso olhar a pergunta na tela compartilhada para saber qual escolher.
7. Se quiser adiantar (por exemplo, se ninguém mais vai responder), clique em **Pular pergunta** para revelar a resposta na hora, sem esperar o tempo acabar.
8. Passado o tempo (ou ao pular), a resposta certa é revelada, com o ranking atualizado. Clique em **Próxima pergunta** para seguir.
9. Ao final, aparece o pódio com os 3 primeiros colocados.

Quem responde mais rápido E certo ganha mais pontos (de 500 a 1000 por questão certa).

**Sobre o QR code:** ele só funciona depois que o jogo estiver publicado online (pelo GitHub Pages, passo 4 abaixo). Testando localmente no seu computador (abrindo o arquivo direto), o QR code fica escondido automaticamente, porque um link local não pode ser aberto por outro aparelho.

---

## Como editar as perguntas

Abra `questions.js` (botão direito > Abrir com > Bloco de Notas). Cada pergunta segue este formato:

```js
{
  text: "Enunciado da pergunta",
  options: ["Alternativa vermelha", "Alternativa azul", "Alternativa amarela", "Alternativa verde"],
  correctIndex: 1,     // posição da certa: 0=vermelho, 1=azul, 2=amarelo, 3=verde
  duration: 20,         // segundos para responder
  translation: "Tradução da frase trabalhada"  // opcional — aparece só na revelação
}
```

Adicione, remova ou reordene perguntas na lista `QUESTIONS`. Sempre mantenha exatamente 4 alternativas por pergunta.

As perguntas de exemplo seguem seu método: cada expressão vem ancorada num contexto real (uma fala, uma cena, uma música), em vez de tradução solta — troque pelos exemplos autênticos que você já usa em aula.

**Sobre o campo `translation`:** é opcional. Se presente, a tradução aparece tanto na sua tela quanto na tela do aluno, mas só depois que a pergunta é revelada (depois que todos já responderam) — assim ninguém usa a tradução para "colar" durante a pergunta. Se não quiser tradução numa pergunta específica, é só apagar essa linha do bloco dela.

## Personalizar tempo, cores e nome

- **Tempo por pergunta:** campo `duration` em `questions.js` (em segundos).
- **Cores:** no início do arquivo `style.css`, nas variáveis `--vermelho`, `--azul`, `--amarelo`, `--verde`.
- **Nome do jogo:** título dentro das tags `<h1>` em `index.html` e `host.html`.

## Limitações a ter em mente

- Os alunos só conseguem entrar enquanto a sala está na tela de espera (antes de clicar em "Iniciar jogo"). Quem chegar atrasado espera a próxima partida.
- O texto e as alternativas de cada pergunta ficam no banco de dados assim que a sala é criada — um aluno mais curioso que abrir as ferramentas de desenvolvedor do navegador conseguiria ver os enunciados com antecedência (a resposta certa, essa não é exposta até a revelação). Para uso comum em sala, isso não costuma ser problema.
- Se dois alunos usarem o mesmo nome, o ranking mostra os dois separadamente — combine com a turma usar nomes únicos.
- O código de sala é de 4 dígitos (até 9000 combinações); é reaproveitado quando o jogo termina, então salas antigas some com o tempo, mas para turmas pequenas nunca dá conflito.

Qualquer ajuste que precisar (mais perguntas, temas diferentes, novo visual), é só pedir.
