/* ==========================================================
   AULA 07: DOM AVANÇADO - PROJETO ECOCYCLE
   Gabarito dos Exercícios

   Exercício 1 — Navegação na árvore DOM
   Exercício 2 — Criar notícia dinamicamente (createElement + prepend)
   Exercício 3 — Remover e clonar cards
   Exercício 4 — Formulário sem recarregar (preventDefault)
   Exercício 5 — Delegação de eventos na lista de notícias
   ========================================================== */


// ─────────────────────────────────────────────────────────
// MANTIDOS DA AULA 6 (sem alteração)
// ─────────────────────────────────────────────────────────

// Simulador de água
const inputPapel = document.querySelector("#input-papel");
const resultadoAgua = document.querySelector("#txt-resultado strong");

if (inputPapel && resultadoAgua) {
  inputPapel.addEventListener("input", () => {
    const kg = Number(inputPapel.value);
    resultadoAgua.textContent = kg * 10;
  });
}

// Controlo do vídeo
const btnVideo = document.querySelector("#btn-video");
const thumbnail = document.querySelector("#thumb-video");

if (btnVideo && thumbnail) {
  btnVideo.addEventListener("click", (event) => {
    event.preventDefault();
    thumbnail.style.display = "none";
    btnVideo.textContent = "A reproduzir...";
    btnVideo.style.backgroundColor = "#555";
    btnVideo.disabled = true;
  });
}


// ─────────────────────────────────────────────────────────
// EXERCÍCIO 1 — Navegação na Árvore DOM
//
// Tarefas:
// a) Selecionar .lista-noticias e exibir no console
//    quantos cards ela possui (children.length)
// b) A partir da lista, acessar o PRIMEIRO card e
//    adicionar a classe "noticia-destaque"
// c) A partir do primeiro card, acessar o PRÓXIMO
//    irmão e alterar o título (h2) para "Notícia em Alta"
//
// parentElement sobe na árvore.
// children desce para os filhos diretos (só elementos HTML).
// firstElementChild → atalho para o primeiro filho.
// nextElementSibling → irmão seguinte na árvore.
// ─────────────────────────────────────────────────────────

const lista = document.querySelector("#lista-noticias");

// a) Quantidade de cards
console.log("Total de cards:", lista.children.length);

// b) Primeiro card recebe destaque
const primeiroCard = lista.firstElementChild;
primeiroCard.classList.add("noticia-destaque");

// c) Segundo card (irmão seguinte) tem o título alterado
const segundoCard = primeiroCard.nextElementSibling;
if (segundoCard) {
  segundoCard.querySelector("h2").textContent = "Notícia em Alta";
}


// ─────────────────────────────────────────────────────────
// EXERCÍCIO 2 — Função para criar card de notícia
//
// Cria um novo <article class="card-noticia"> com:
//   <h2>, <p class="desc"> e <button class="btn-leitura">
// Insere como PRIMEIRO card da lista (prepend).
//
// createElement → cria o elemento na memória
// innerHTML     → aqui usamos para montar o conteúdo interno
//                 de uma vez (o card em si não tem eventos)
// prepend       → insere como primeiro filho (topo da lista)
// ─────────────────────────────────────────────────────────

function adicionarNoticia(titulo, descricao) {
  const novoCard = document.createElement("article");
  novoCard.classList.add("card-noticia");

  novoCard.innerHTML =
    "<h2>" + titulo + "</h2>" +
    "<p class='desc'>" + descricao + "</p>" +
    "<button class='btn-leitura'>Leia Mais</button>";

  lista.prepend(novoCard);
}


// ─────────────────────────────────────────────────────────
// EXERCÍCIO 3 — Remover e clonar cards
//
// Parte A — Remover: ao clicar num .btn-leitura,
//   o card inteiro é removido da lista.
//   Usamos parentElement para subir do botão até o card.
//   remove() → o elemento se remove sozinho, sem precisar do pai.
//
// Parte B — Clonar: um botão fixo clona o firstElementChild
//   da lista e insere no final com appendChild.
//   cloneNode(true) → clona com todos os filhos internos.
//   Após clonar, alteramos o título para diferenciar visualmente.
//
// ATENÇÃO: remover individualmente era feito com forEach (Aula 6).
//   Na Aula 7 usamos delegação (Exercício 5) — mas aqui mostramos
//   o conceito de remove() + parentElement isolado.
// ─────────────────────────────────────────────────────────

// Parte B — Botão de duplicar (fixo na página via JS)
const btnDuplicar = document.createElement("button");
btnDuplicar.textContent = "Duplicar Primeira Notícia";
btnDuplicar.id = "btn-duplicar";
document.querySelector("main").insertAdjacentElement("afterbegin", btnDuplicar);

btnDuplicar.addEventListener("click", () => {
  const original = lista.firstElementChild;
  if (!original) return;

  const copia = original.cloneNode(true);

  // Altera o título da cópia para diferenciar
  const tituloCopia = copia.querySelector("h2");
  if (tituloCopia) {
    tituloCopia.textContent = "[CÓPIA] " + tituloCopia.textContent;
  }

  lista.appendChild(copia);
});


// ─────────────────────────────────────────────────────────
// EXERCÍCIO 4 — Formulário sem recarregar (preventDefault)
//
// Captura o submit do #form-sugestao.
// event.preventDefault() impede o recarregamento da página.
// Lê os valores dos campos e chama adicionarNoticia() (Ex. 2).
// Limpa os campos após o envio (campo.value = "").
//
// Por que preventDefault aqui é obrigatório?
// Formulários HTML recarregam a página ao serem enviados —
// o comportamento padrão do navegador. Sem preventDefault,
// o card seria criado e sumia imediatamente com o reload.
// ─────────────────────────────────────────────────────────

const formSugestao = document.querySelector("#form-sugestao");

if (formSugestao) {
  formSugestao.addEventListener("submit", (event) => {
    event.preventDefault();

    const campoTitulo = document.querySelector("#input-titulo");
    const campoDesc = document.querySelector("#input-desc");

    const titulo = campoTitulo.value.trim();
    const descricao = campoDesc.value.trim();

    // Validação básica: não adicionar se os campos estiverem vazios
    if (!titulo || !descricao) {
      alert("Preencha o título e a descrição antes de adicionar!");
      return;
    }

    adicionarNoticia(titulo, descricao);

    // Limpa os campos após o envio
    campoTitulo.value = "";
    campoDesc.value = "";
  });
}


// ─────────────────────────────────────────────────────────
// EXERCÍCIO 5 — Delegação de Eventos na lista de notícias
//
// Remove os listeners individuais dos botões .btn-leitura
// (que eram feitos com forEach na Aula 6) e substitui
// por UM ÚNICO listener na .lista-noticias.
//
// Dentro do listener, event.target identifica o clique:
//   .btn-leitura → alterna a classe "card-expandido" no card pai
//   .btn-remover → remove o card inteiro (Exercício 3 — Parte A)
//
// Vantagem: cards novos criados pelo Exercício 2 (adicionarNoticia)
// já respondem automaticamente — sem precisar de novos listeners.
// ─────────────────────────────────────────────────────────

lista.addEventListener("click", (event) => {
  const clicado = event.target;

  // Clique em .btn-leitura → expande/recolhe o card
  if (clicado.classList.contains("btn-leitura") && clicado.id !== "btn-video") {
    event.preventDefault();

    const card = clicado.parentElement;
    card.classList.toggle("card-expandido");

    // Altera o texto do botão conforme o estado
    clicado.textContent = card.classList.contains("card-expandido")
      ? "Fechar"
      : "Leia Mais";
  }

  // Clique em .btn-remover → remove o card inteiro
  if (clicado.classList.contains("btn-remover")) {
    const card = clicado.parentElement;
    card.remove();
  }
});