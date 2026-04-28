/* ==========================================================
   AULA 08: WEB STORAGE - PROJETO ECOCYCLE
   Gabarito dos Exercícios

   Exercício 1 — Primeiros passos (console — sem código aqui)
   Exercício 2 — Salvar e ler preferências (objeto no localStorage)
   Exercício 3 — Lista de notícias persistida
   Exercício 4 — Botão limpar dados salvos
   Exercício 5 — EcoCycle com memória completa
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  // Exercício 5: contador de visitas — roda antes de tudo
  contarVisita();

  // Exercício 2: restaura o último valor do simulador
  restaurarPreferencias();

  // Exercício 3: restaura notícias salvas
  restaurarNoticias();

  // Mantidos da Aula 6
  inicializarSimulador();
  inicializarVideo();

  // Aula 7: delegação já cuida dos botões de leitura
  inicializarDelegacao();

  // Exercício 4: botão limpar storage
  inicializarBotaoLimpar();
});

// ─────────────────────────────────────────────────────────────────────────────
// Exercício 2 — Preferências no localStorage
//
// Salva { tema, ultimoValorPapel } sob a chave "ecocycle_prefs".
// Padrão ler → modificar → salvar:
//   lerPrefs()   → retorna o objeto atual (ou padrão se não existir)
//   salvarPrefs() → converte para string com JSON.stringify e salva
//
// Por que || com objeto padrão?
// Se a chave não existe, getItem retorna null.
// JSON.parse(null) lança erro — o || garante que começamos com valores seguros.
// ─────────────────────────────────────────────────────────────────────────────
var PREFS_PADRAO = { tema: "claro", ultimoValorPapel: 0 };

function lerPrefs() {
  return JSON.parse(
    localStorage.getItem("ecocycle_prefs") || JSON.stringify(PREFS_PADRAO),
  );
}

function salvarPrefs(prefs) {
  localStorage.setItem("ecocycle_prefs", JSON.stringify(prefs));
}

function restaurarPreferencias() {
  var prefs = lerPrefs();
  var inputPapel = document.querySelector("#input-papel");

  // Restaura o último valor digitado no simulador
  if (inputPapel && prefs.ultimoValorPapel) {
    inputPapel.value = prefs.ultimoValorPapel;

    // Atualiza o resultado na tela para refletir o valor restaurado
    var resultadoAgua = document.querySelector("#txt-resultado strong");
    if (resultadoAgua) {
      resultadoAgua.textContent = prefs.ultimoValorPapel * 10;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mantido da Aula 6 — com adição da persistência (Exercício 2)
// ─────────────────────────────────────────────────────────────────────────────
function inicializarSimulador() {
  var inputPapel = document.querySelector("#input-papel");
  var resultadoAgua = document.querySelector("#txt-resultado strong");

  if (!inputPapel || !resultadoAgua) return;

  inputPapel.addEventListener("input", function () {
    var kg = Number(inputPapel.value);
    resultadoAgua.textContent = kg * 10;

    // Exercício 2: salva o valor atual nas preferências
    // Padrão ler → modificar → salvar
    var prefs = lerPrefs();
    prefs.ultimoValorPapel = kg;
    salvarPrefs(prefs);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Exercício 3 — Lista de notícias persistida
//
// adicionarNoticia(): cria o card no DOM E salva no localStorage.
// restaurarNoticias(): lê a lista salva e recria os cards ao carregar a página.
//
// Padrão de lista no localStorage:
//   ler → push → salvar (Create)
//   ler → exibir (Read)
//   Cada notícia é { titulo, descricao }
// ─────────────────────────────────────────────────────────────────────────────
function adicionarNoticia(titulo, descricao) {
  var lista = document.querySelector("#lista-noticias");
  if (!lista) return;

  // Cria o card no DOM (Aula 7 — createElement)
  var novoCard = document.createElement("article");
  novoCard.classList.add("card-noticia");
  novoCard.innerHTML =
    "<h2>" +
    titulo +
    "</h2>" +
    "<p class='desc'>" +
    descricao +
    "</p>" +
    "<button class='btn-leitura'>Leia Mais</button>";

  lista.prepend(novoCard);

  // Exercício 3: salva no localStorage — padrão ler → push → salvar
  var noticias = JSON.parse(localStorage.getItem("ecocycle_noticias") || "[]");
  noticias.push({ titulo: titulo, descricao: descricao });
  localStorage.setItem("ecocycle_noticias", JSON.stringify(noticias));
}

function restaurarNoticias() {
  // Lê a lista salva — padrão seguro com || "[]"
  var noticias = JSON.parse(localStorage.getItem("ecocycle_noticias") || "[]");

  // Recria cada card sem salvar de novo (evita duplicatas no storage)
  noticias.forEach(function (n) {
    var lista = document.querySelector("#lista-noticias");
    if (!lista) return;

    var card = document.createElement("article");
    card.classList.add("card-noticia");
    card.innerHTML =
      "<h2>" +
      n.titulo +
      "</h2>" +
      "<p class='desc'>" +
      n.descricao +
      "</p>" +
      "<button class='btn-leitura'>Leia Mais</button>";

    lista.prepend(card);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Exercício 4 — Botão limpar dados salvos
//
// removeItem vs clear:
// clear() apaga TUDO no localStorage do domínio — perigoso em apps reais.
// removeItem("chave") remove apenas o que queremos — mais seguro e preciso.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarBotaoLimpar() {
  var btn = document.querySelector("#btn-limpar-storage");
  if (!btn) return;

  btn.addEventListener("click", function () {
    // Remove só as chaves do EcoCycle — não apaga dados de outros sites
    localStorage.removeItem("ecocycle_noticias");
    localStorage.removeItem("ecocycle_prefs");
    localStorage.removeItem("ecocycle_visitas");

    // Restaura a tela ao estado inicial sem recarregar
    var lista = document.querySelector("#lista-noticias");
    if (lista) {
      // Remove cards criados dinamicamente (mantém os 3 originais do HTML)
      var cardsDinamicos = lista.querySelectorAll(
        ".card-noticia:not(.card-original)",
      );
      cardsDinamicos.forEach(function (c) {
        c.remove();
      });
    }

    // Zera o simulador
    var inputPapel = document.querySelector("#input-papel");
    var resultado = document.querySelector("#txt-resultado strong");
    if (inputPapel) inputPapel.value = 0;
    if (resultado) resultado.textContent = 0;

    alert("Dados salvos removidos com sucesso!");
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Exercício 5 — Contador de visitas
//
// A cada carregamento da página:
// 1. Lê o contador atual (ou 0 se não existir)
// 2. Incrementa 1
// 3. Salva de volta
// 4. Exibe no header
//
// Number(... || 0): getItem retorna string ou null.
// Number(null) → 0, Number("3") → 3 — conversão segura.
// ─────────────────────────────────────────────────────────────────────────────
function contarVisita() {
  var visitas = Number(localStorage.getItem("ecocycle_visitas") || 0);
  visitas++;
  localStorage.setItem("ecocycle_visitas", visitas);

  // Exibe no título do portal
  var titulo = document.querySelector("#titulo-portal");
  if (titulo && visitas > 1) {
    titulo.title = "Esta é sua " + visitas + "ª visita ao EcoCycle!";
  }

  // Exibe no header como subtítulo discreto
  var header = document.querySelector("#cabecalho-eco");
  if (header) {
    var spanVisita = document.createElement("span");
    spanVisita.id = "contador-visita";
    spanVisita.textContent =
      visitas > 1
        ? "Bem-vindo de volta! Esta é sua " + visitas + "ª visita."
        : "Bem-vindo ao EcoCycle! 🌿";
    header.appendChild(spanVisita);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Mantido da Aula 6
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// Mantido da Aula 7 — delegação + formulário de sugestão
//
// Conexão com Exercício 3: ao adicionar notícia pelo formulário,
// adicionarNoticia() já cuida de salvar no localStorage automaticamente.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarDelegacao() {
  var lista = document.querySelector("#lista-noticias");
  if (lista) {
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

      if (clicado.classList.contains("btn-remover")) {
        clicado.parentElement.remove();
      }
    });
  }

  var formSugestao = document.querySelector("#form-sugestao");
  if (formSugestao) {
    formSugestao.addEventListener("submit", function (event) {
      event.preventDefault();

      var campoTitulo = document.querySelector("#input-titulo");
      var campoDesc = document.querySelector("#input-desc");
      var titulo = campoTitulo.value.trim();
      var descricao = campoDesc.value.trim();

      if (!titulo || !descricao) {
        alert("Preencha o título e a descrição!");
        return;
      }

      // adicionarNoticia() já salva no localStorage (Exercício 3)
      adicionarNoticia(titulo, descricao);
      campoTitulo.value = "";
      campoDesc.value = "";
    });
  }
}
