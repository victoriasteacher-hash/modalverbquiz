/*
  CONFIGURAÇÃO DO FIREBASE
  ------------------------
  Substitua os valores abaixo pelos dados do SEU projeto Firebase.
  Onde encontrar: console.firebase.google.com > seu projeto > ⚙️ Configurações do projeto
  > role até "Seus apps" > ícone "</>" (Web) > copie o objeto firebaseConfig.

  Veja o README.md para o passo a passo completo (leva uns 10 minutos).
*/

const firebaseConfig = {
  apiKey: "AIzaSyCru_OHqKSs5KueNUeggmnK83b959Bg1HM",
  authDomain: "modalverbsquiz.firebaseapp.com",
  databaseURL: "https://modalverbsquiz-default-rtdb.firebaseio.com",
  projectId: "modalverbsquiz",
  storageBucket: "modalverbsquiz.firebasestorage.app",
  messagingSenderId: "75592138856",
  appId: "1:75592138856:web:a80b0edda2005fb1a0bbdd"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();
