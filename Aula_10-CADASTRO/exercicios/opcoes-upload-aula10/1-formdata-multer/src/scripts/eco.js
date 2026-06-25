/* ==========================================================
   AULA 09: FETCH API - PROJETO ECOCYCLE
   Gabarito dos Exercícios

   Exercício 1 — Primeiro fetch no console (sem arquivo — console)
   Exercício 2 — Buscar notícias de uma API simulada
   Exercício 3 — POST de sugestão com try/catch
   Exercício 4 — Tratando erros de rede
   Exercício 5 — sessionStorage: popup de boas-vindas
   ========================================================== */

var API_URL = "http://localhost:3000";

document.addEventListener("DOMContentLoaded", function () {
  // Exercício 5: popup de boas-vindas com sessionStorage
  solicitarNomeEco();

  // Mantidos das aulas anteriores
  inicializarSimulador();
  inicializarVideo();
  inicializarDelegacao();

  // Exercício 2: busca notícias da API ao carregar
  buscarNoticias();
});

// ─────────────────────────────────────────────────────────────────────────────
// Exercício 5 — sessionStorage: popup de boas-vindas
//
// sessionStorage dura só enquanto a aba estiver aberta.
// Feche e abra a aba — o nome some (diferente do localStorage).
// Ideal para EcoCycle: cada visita é uma sessão nova.
// ─────────────────────────────────────────────────────────────────────────────
function solicitarNomeEco() {
  if (sessionStorage.getItem("eco_usuario")) {
    exibirNomeEco();
    return;
  }

  var modal = document.getElementById("modal-eco");
  if (modal) modal.style.display = "flex";

  var btn = document.getElementById("btn-confirmar-eco");
  var input = document.getElementById("input-nome-eco");

  if (!btn || !input) return;

  btn.addEventListener("click", function () {
    var nome = input.value.trim();
    if (!nome) {
      input.focus();
      return;
    }

    // salva na sessão — some ao fechar a aba
    sessionStorage.setItem("eco_usuario", nome);
    modal.style.display = "none";
    exibirNomeEco();
  });

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") btn.click();
  });

  setTimeout(function () {
    input.focus();
  }, 100);
}

function exibirNomeEco() {
  var nome = sessionStorage.getItem("eco_usuario");
  var saudacao = document.getElementById("boas-vindas-eco");
  if (!saudacao) return;

  if (nome) {
    saudacao.textContent = "Bem-vindo, " + nome + "! 🌿";
  } else {
    saudacao.textContent = "Olá! Seja bem-vindo ao EcoCycle 🌿";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exercício 2 — Buscar notícias de uma API
//
// async/await com try/catch — padrão aprendido na Aula 9.
// Se der erro na requisição, exibe mensagem amigável na tela.
// Os cards são criados com createElement — Aula 7.
//
// Nota: como /noticias não existe no back-end do TechFood,
// o catch vai ser acionado — mostrando o tratamento de erro na prática.
// ─────────────────────────────────────────────────────────────────────────────
async function buscarNoticias() {
  var lista = document.querySelector("#lista-noticias");
  if (!lista) return;

  try {
    var res = await fetch(API_URL + "/noticias");

    // res.ok é false para 404 e 500 — fetch não lança erro nesses casos
    if (!res.ok)
      throw new Error(
        "Rota /noticias não encontrada (status " + res.status + ")",
      );

    var dados = await res.json();
    var noticias = dados.dados || dados;

    noticias.forEach(function (noticia) {
      adicionarNoticiaDOM(noticia.titulo, noticia.descricao);
    });
  } catch (erro) {
    // exibe mensagem amigável — não quebra a página
    var aviso = document.createElement("p");
    aviso.style.cssText =
      "color:#e74c3c;text-align:center;padding:1rem;grid-column:1/-1";
    aviso.textContent =
      "⚠ Não foi possível carregar notícias da API: " + erro.message;
    lista.appendChild(aviso);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Exercício 3 — POST de sugestão com try/catch
//
// event.preventDefault() — Aula 7: evita recarregamento da página.
// fetch com POST — Aula 9: envia os dados para o servidor.
// Se o POST falhar, ainda cria o card na tela (degradação graciosa).
// ─────────────────────────────────────────────────────────────────────────────
var formSugestao = document.querySelector("#form-sugestao");
if (formSugestao) {
  formSugestao.addEventListener("submit", async function (event) {
    event.preventDefault();

    var titulo = document.querySelector("#input-titulo").value.trim();
    var descricao = document.querySelector("#input-desc").value.trim();

    if (!titulo || !descricao) {
      alert("Preencha título e descrição!");
      return;
    }

    // sempre cria o card na tela — independente do POST
    adicionarNoticiaDOM(titulo, descricao);

    try {
      var res = await fetch(API_URL + "/noticias", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descricao }),
      });

      var dados = await res.json();
      console.log("Resposta do servidor:", dados);

      // res.ok verifica se o status foi 200-299
      if (!res.ok) throw new Error(dados.erro || "Erro ao salvar no servidor");

      console.log("✔ Sugestão enviada para o servidor com sucesso!");
    } catch (erro) {
      // POST falhou mas o card já foi criado — informa no console
      console.warn("⚠ Não foi possível enviar para o servidor:", erro.message);
      console.warn("O card foi criado localmente.");
    }

    document.querySelector("#input-titulo").value = "";
    document.querySelector("#input-desc").value = "";
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Exercício 4 — Tratamento de erros de rede
//
// Os cenários abordados nas atividades são demonstrados aqui:
// - Servidor offline → catch captura "Failed to fetch"
// - Rota inexistente → res.ok é false (404), fetch não joga no catch
// - Sem CORS → catch captura erro de CORS
//
// Esta função é chamada apenas nos testes do exercício — não no DOMContentLoaded.
// ─────────────────────────────────────────────────────────────────────────────
async function testarErros(url) {
  try {
    var res = await fetch(url);
    var dados = await res.json();

    if (!res.ok) {
      console.error(
        "Erro HTTP " + res.status + ":",
        dados.erro || "Sem mensagem",
      );
      return;
    }

    console.log("Sucesso:", dados);
  } catch (erro) {
    if (erro.message.includes("CORS")) {
      console.error(
        "❌ CORS bloqueado — o servidor precisa liberar esta origem.",
      );
    } else if (erro.message.includes("fetch")) {
      console.error("❌ Servidor offline ou URL inválida:", erro.message);
    } else {
      console.error("❌ Erro desconhecido:", erro.message);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// adicionarNoticiaDOM() — mantido da Aula 7/8
// Cria card de notícia no DOM com createElement.
// ─────────────────────────────────────────────────────────────────────────────
function adicionarNoticiaDOM(titulo, descricao) {
  var lista = document.querySelector("#lista-noticias");
  if (!lista) return;

  var card = document.createElement("article");
  card.classList.add("card-noticia");
  card.innerHTML =
    "<h2>" +
    titulo +
    "</h2>" +
    "<p class='desc'>" +
    descricao +
    "</p>" +
    "<button class='btn-leitura'>Leia Mais</button>";

  lista.prepend(card);
}

// ─────────────────────────────────────────────────────────────────────────────
// Mantidos das aulas anteriores
// ─────────────────────────────────────────────────────────────────────────────
function inicializarSimulador() {
  var inputPapel = document.querySelector("#input-papel");
  var resultadoAgua = document.querySelector("#txt-resultado strong");
  if (!inputPapel || !resultadoAgua) return;

  inputPapel.addEventListener("input", function () {
    resultadoAgua.textContent = Number(inputPapel.value) * 10;
  });
}

function inicializarVideo() {
  var btnVideo = document.querySelector("#btn-video");
  var thumbnail = document.querySelector("#thumb-video");
  if (!btnVideo || !thumbnail) return;

  btnVideo.addEventListener("click", function (event) {
    event.preventDefault();
    thumbnail.style.display = "none";
    btnVideo.textContent = "A reproduzir...";
    btnVideo.style.backgroundColor = "#555";
    btnVideo.disabled = true;
  });
}

function inicializarDelegacao() {
  var lista = document.querySelector("#lista-noticias");
  if (!lista) return;

  lista.addEventListener("click", function (event) {
    var clicado = event.target;

    if (
      clicado.classList.contains("btn-leitura") &&
      clicado.id !== "btn-video"
    ) {
      event.preventDefault();
      var card = clicado.parentElement;
      card.classList.toggle("card-expandido");
      clicado.textContent = card.classList.contains("card-expandido")
        ? "Fechar"
        : "Leia Mais";
    }
  });
}
