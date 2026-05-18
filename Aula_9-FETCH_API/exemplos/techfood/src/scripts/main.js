/* ==========================================================
   MAIN.JS — Lógica da página do Cardápio (index.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — inicializarSubtotal(), inicializarHoverCards(),
                 inicializarVitrine(), atualizarPrecoCard(),
                 salvarPedido() (localStorage), atualizarContadorPedidos()
   [✔] Aula 9  — renderizarCardapio() adicionada: cards agora vêm da API.
                 salvarPedido() mantém localStorage (como Aula 8), mas salva
                 produto_id para que pedidos.js possa enviar à API.
                 O POST /pedidos acontece em pedidos.js via "Enviar para Cozinha".
                 inicializarSubtotal() removida: não faz mais sentido porque
                 os cards fixos do HTML sumiram — o grid é montado pela API.
   [ ] Aula 10 — cadastrarProduto() via cadastro.js
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  renderizarCardapio(); // NEW — busca produtos da API e monta os cards
  inicializarVitrine();
  inicializarHoverCards();
});

// ─────────────────────────────────────────────────────────────────────────────
// renderizarCardapio()                                                    NEW
// Aula 9: os cards que estavam fixos no HTML agora vêm do banco de dados.
//
// Por que inicializarSubtotal() foi removida do DOMContentLoaded?
//   Na Aula 8, os cards eram fixos no HTML — havia um campo #qtd-lasanha
//   fixo que o inicializarSubtotal() controlava. Na Aula 9, o grid vem
//   vazio do servidor e é preenchido aqui. Não existe mais #qtd-lasanha
//   no HTML — então inicializarSubtotal() não teria nada para encontrar.
//   A lógica de preço agora é toda controlada por atualizarPrecoCard().
//
// data-id: o produto_id do banco — adicionado no card aqui.
//   Quando o cliente clicar em Pedir Agora, usamos esse ID para mandar
//   ao servidor — não o nome do prato.
//
// try/catch: captura erros de rede ou servidor offline e mostra mensagem.
// ─────────────────────────────────────────────────────────────────────────────
async function renderizarCardapio() {
  var grid = document.querySelector("#grid-cardapio");
  if (!grid) return;

  // Mostra loading enquanto a requisição não volta
  grid.innerHTML = "<p class='loading'>Carregando cardápio...</p>";

  try {
    var produtos = await buscarProdutos(); // api.js — GET /produtos

    grid.innerHTML = "";

    produtos.forEach(function (produto) {
      var card = document.createElement("article");
      card.classList.add("card");
      card.setAttribute("data-id", produto.produto_id); // ID do banco

      card.innerHTML =
        "<img src='src/images/" +
        produto.imagem +
        "' alt='" +
        produto.nome +
        "'>" +
        "<h3>" +
        produto.nome +
        "</h3>" +
        "<p class='desc'>" +
        produto.descricao +
        "</p>" +
        "<div class='quantidade-box'>" +
        "<button class='btn-qtd btn-menos'>-</button>" +
        "<span class='qtd-valor'>1</span>" +
        "<button class='btn-qtd btn-mais'>+</button>" +
        "</div>" +
        "<span class='preco' data-preco='" +
        produto.preco +
        "'>" +
        "R$ " +
        parseFloat(produto.preco).toFixed(2).replace(".", ",") +
        "</span>" +
        "<button class='btn-pedido'>Pedir Agora</button>";

      grid.appendChild(card);
    });
  } catch (erro) {
    // try/catch captura erros de rede ou servidor offline
    grid.innerHTML = "<p class='loading erro'>Erro ao carregar o cardápio.</p>";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// inicializarHoverCards()
// Aula 8: sem mudanças. Mantido exatamente como estava.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarHoverCards() {
  var cards = document.querySelectorAll(".card");

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      card.style.transform = "translateY(-5px)";
      card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
    });
    card.addEventListener("mouseleave", function () {
      card.style.transform = "translateY(0)";
      card.style.boxShadow = "none";
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// inicializarVitrine()
// Aula 8: delegação de eventos no <main> com btn-menos, btn-mais e btn-pedido.
//
// Aula 9 — o que mudou dentro do bloco btn-pedido:
//   ⚠ Aula 8 lia nome/preco do card e chamava salvarPedido({ nome, preco, qtd })
//   ⚠ Aula 9 lê o data-id do card e chama salvarPedido(produtoId, quantidade, clicado)
//     — o botão é passado como parâmetro para o feedback ser controlado
//       dentro da função (que agora depende da resposta do servidor)
//   O resto da delegação (btn-menos, btn-mais) é idêntico à Aula 8.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarVitrine() {
  var main = document.querySelector("main");
  if (!main) return;

  main.addEventListener("click", function (event) {
    var clicado = event.target;

    // ── Botão MENOS — idêntico à Aula 8 ─────────────────────────────────────
    if (clicado.classList.contains("btn-menos")) {
      var box = clicado.parentElement;
      var spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Math.max(1, Number(spanQtd.textContent) - 1);
      atualizarPrecoCard(box);
      return;
    }

    // ── Botão MAIS — idêntico à Aula 8 ──────────────────────────────────────
    if (clicado.classList.contains("btn-mais")) {
      var box = clicado.parentElement;
      var spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Number(spanQtd.textContent) + 1;
      atualizarPrecoCard(box);
      return;
    }

    // ── Botão PEDIR AGORA ────────────────────────────────────────────────────
    if (clicado.classList.contains("btn-pedido")) {
      event.preventDefault();

      var card = clicado.parentElement;

      // ⚠ Aula 9: lê o data-id do card (produto_id do banco)
      // adicionado por renderizarCardapio() — não existe mais data-nome
      var produtoId = Number(card.getAttribute("data-id"));
      var quantidade = Number(card.querySelector(".qtd-valor").textContent);

      // salvarPedido salva no localStorage e exibe o feedback no botão
      salvarPedido(produtoId, quantidade, clicado);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarPrecoCard()
// Aula 8: sem mudanças. Recalcula o preço no card quando muda a quantidade.
// ─────────────────────────────────────────────────────────────────────────────
function atualizarPrecoCard(box) {
  var card = box.parentElement;
  var spanPreco = card.querySelector(".preco");
  var precoUnitario = parseFloat(spanPreco.getAttribute("data-preco"));
  var quantidade = Number(box.querySelector(".qtd-valor").textContent);
  var total = precoUnitario * quantidade;

  spanPreco.textContent = "R$ " + total.toFixed(2).replace(".", ",");
  spanPreco.style.color = total > 150 ? "#c0392b" : "#e67e22";
}

// ─────────────────────────────────────────────────────────────────────────────
// salvarPedido(produtoId, quantidade, botao)
// Aula 8: guardava { nome, preco, qtd, subtotal } no localStorage.
//
// Aula 9: salva também produto_id — necessário para enviar à API.
//   O envio real acontece em pedidos.html via "Enviar para Cozinha".
//   Isso separa a montagem do pedido (aqui) do envio ao banco (pedidos.js),
//   tornando o POST /pedidos um momento explícito e ensinável.
//
//   Diferença do campo: Aula 8 usava qtd, Aula 9 usa quantidade —
//   para coincidir com o formato que criarPedido() do api.js espera.
// ─────────────────────────────────────────────────────────────────────────────
function salvarPedido(produtoId, quantidade, botao) {
  var card    = botao.parentElement;
  var nome    = card.querySelector("h3").textContent;
  var preco   = parseFloat(card.querySelector(".preco").getAttribute("data-preco"));
  var subtotal = preco * quantidade;

  // Padrão Aula 8: ler → modificar → salvar
  var lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  lista.push({
    produto_id: produtoId,  // ⚠ novo em Aula 9 — usado pelo criarPedido()
    quantidade: quantidade,  // ⚠ renomeado de qtd para quantidade (formato API)
    nome:       nome,
    preco:      preco,
    subtotal:   subtotal
  });
  localStorage.setItem("techfood_pedidos", JSON.stringify(lista));

  // Feedback visual — igual Aula 8
  botao.textContent          = "✓ Adicionado!";
  botao.style.backgroundColor = "#27ae60";

  atualizarContadorPedidos();

  setTimeout(function () {
    botao.textContent          = "Pedir Agora";
    botao.style.backgroundColor = "";
    botao.disabled              = false;

    var box = card.querySelector(".quantidade-box");
    if (box) {
      box.querySelector(".qtd-valor").textContent = "1";
      atualizarPrecoCard(box);
    }
  }, 1500);
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarContadorPedidos()
// Aula 8: lia o localStorage para contar pedidos.
// Aula 9: mantém localStorage — o carrinho fica aqui até o "Enviar para Cozinha".
// ─────────────────────────────────────────────────────────────────────────────
function atualizarContadorPedidos() {
  var lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  var total = lista.reduce(function (acc, p) { return acc + p.quantidade; }, 0);

  var linkMenu = document.querySelector("#menu a[href='pedidos.html']");
  if (!linkMenu) return;

  var badge = linkMenu.querySelector(".badge-menu");
  if (!badge) {
    linkMenu.insertAdjacentHTML("beforeend", "<span class='badge-menu'>0</span>");
    badge = linkMenu.querySelector(".badge-menu");
  }

  badge.textContent = total;
  linkMenu.classList.add("menu-ativo");
}
