/* ==========================================================
   MAIN.JS — Lógica da página do Cardápio (index.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — inicializarSubtotal(), inicializarHoverCards(),
                 inicializarVitrine(), atualizarPrecoCard(),
                 salvarPedido() (localStorage), atualizarContadorPedidos().
   [✔] Aula 9  — renderizarCardapio(): cards dinâmicos via GET /produtos.
                 salvarPedido() salva produto_id para o POST /pedidos.
   [✔] Aula 10 — renderizarCardapioPorCategoria(): substitui renderizarCardapio().
                 Agrupa os cards em seções por categoria (Massas, Sobremesas,
                 Bebidas, Entradas) com base no campo "categoria" do banco.
                 Imagens ativadas: src/images/ agora populada via cadastro.js.
   [ ] Futuro  — Filtro por tab/botão de categoria no topo.
                 Seção de destaques para pratos marcados como featured.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  renderizarCardapioPorCategoria(); // Aula 10 — substitui renderizarCardapio()
  inicializarVitrine();
});

// ─────────────────────────────────────────────────────────────────────────────
// renderizarCardapioPorCategoria()                                    UPDATED
// Aula 9: renderizarCardapio() montava uma única grade com todos os pratos.
//
// Aula 10: agrupa os pratos por categoria e cria uma <section> para cada grupo.
//   O campo "categoria" vem do banco (cadastrado pelo admin em cadastro.html).
//   Categorias sem pratos não são exibidas — o cardápio é 100% dinâmico.
//
// ORDEM_CATEGORIAS: define a sequência de exibição das seções.
//   Categorias fora da lista vão para o final como "Outros".
//
// Imagens ativas (Aula 10):
//   produto.imagem → "src/images/nome-do-arquivo.png"
//   Fallback: "src/images/espaguete.png" se a imagem não foi cadastrada.
// ─────────────────────────────────────────────────────────────────────────────
const ORDEM_CATEGORIAS = ["Massas", "Entradas", "Bebidas", "Sobremesas"];

async function renderizarCardapioPorCategoria() {
  const container = document.querySelector("#container-cardapio");
  if (!container) return;

  container.innerHTML = "<p class='loading'>Carregando cardápio...</p>";

  try {
    // ── FETCH API em ação — GET /produtos ──────────────────────────────────
    // buscarProdutos() (api.js) busca todos os pratos do banco.
    // O await pausa aqui até a resposta chegar — sem travar a página.
    const produtos = await buscarProdutos(); // HTTP GET → /produtos

    container.innerHTML = "";

    if (produtos.length === 0) {
      container.innerHTML = "<p class='loading'>Nenhum prato cadastrado ainda. Acesse <a href='cadastro.html'>Cadastrar Prato</a>.</p>";
      return;
    }

    // Agrupa os pratos por categoria
    const grupos = {};
    produtos.forEach(function (produto) {
      const cat = produto.categoria || "Outros";
      if (!grupos[cat]) grupos[cat] = [];
      grupos[cat].push(produto);
    });

    // Ordena as categorias conforme ORDEM_CATEGORIAS (desconhecidas vão ao final)
    const cats = Object.keys(grupos).sort(function (a, b) {
      const ia = ORDEM_CATEGORIAS.indexOf(a);
      const ib = ORDEM_CATEGORIAS.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    });

    // Cria uma <section> por categoria
    cats.forEach(function (categoria) {
      const section = document.createElement("section");
      section.classList.add("secao-categoria");
      section.id = `secao-${categoria.toLowerCase().replace(/\s+/g, "-")}`;

      const titulo = document.createElement("h2");
      titulo.classList.add("titulo-secao");
      titulo.textContent = categoria;
      section.appendChild(titulo);

      const grid = document.createElement("div");
      grid.classList.add("vitrine-grid");

      grupos[categoria].forEach(function (produto) {
        const card = document.createElement("article");
        card.classList.add("card");
        card.setAttribute("data-id", produto.id);

        // Aula 10: imagens ativas — fallback para espaguete.png se não cadastrada
        const imgSrc = produto.imagem
          ? `src/images/${produto.imagem}`
          : "src/images/espaguete.png";

        card.innerHTML =
          `<img src="${imgSrc}" alt="${produto.nome}" class="card-img">` +
          `<h3>${produto.nome}</h3>` +
          `<p class="desc">${produto.descricao}</p>` +
          `<div class="quantidade-box">` +
            `<button class="btn-qtd btn-menos">-</button>` +
            `<span class="qtd-valor">1</span>` +
            `<button class="btn-qtd btn-mais">+</button>` +
          `</div>` +
          `<span class="preco" data-preco="${produto.preco}">` +
            `R$ ${parseFloat(produto.preco).toFixed(2).replace(".", ",")}` +
          `</span>` +
          `<button class="btn-pedido">Pedir Agora</button>`;

        grid.appendChild(card);
      });

      section.appendChild(grid);
      container.appendChild(section);
    });

  } catch (erro) {
    // UX: container exibe erro — usuário sabe que o cardápio não carregou.
    // Diferente do botão de pedido (retry inline), aqui a ação é recarregar a página.
    container.innerHTML =
      "<p class='loading erro'>Erro ao carregar o cardápio. Verifique se o servidor está rodando.</p>";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// inicializarVitrine()
// Aula 8: delegação de eventos no <main>.
// Aula 9/10: sem mudanças de comportamento — só o container HTML mudou.
// ─────────────────────────────────────────────────────────────────────────────
function inicializarVitrine() {
  const main = document.querySelector("main");
  if (!main) return;

  main.addEventListener("click", function (event) {
    const clicado = event.target;

    if (clicado.classList.contains("btn-menos")) {
      const box    = clicado.parentElement;
      const spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Math.max(1, Number(spanQtd.textContent) - 1);
      atualizarPrecoCard(box);
      return;
    }

    if (clicado.classList.contains("btn-mais")) {
      const box    = clicado.parentElement;
      const spanQtd = box.querySelector(".qtd-valor");
      spanQtd.textContent = Number(spanQtd.textContent) + 1;
      atualizarPrecoCard(box);
      return;
    }

    if (clicado.classList.contains("btn-pedido")) {
      event.preventDefault();
      const card      = clicado.parentElement;
      const produtoId = Number(card.getAttribute("data-id"));
      const quantidade = Number(card.querySelector(".qtd-valor").textContent);
      salvarPedido(produtoId, quantidade, clicado);
    }
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarPrecoCard()
// Sem mudanças. Recalcula o preço no card quando muda a quantidade.
// ─────────────────────────────────────────────────────────────────────────────
function atualizarPrecoCard(box) {
  const card          = box.parentElement;
  const spanPreco     = card.querySelector(".preco");
  const precoUnitario = parseFloat(spanPreco.getAttribute("data-preco"));
  const quantidade    = Number(box.querySelector(".qtd-valor").textContent);
  const total         = precoUnitario * quantidade;
  spanPreco.textContent = `R$ ${total.toFixed(2).replace(".", ",")}`;
  spanPreco.style.color = total > 150 ? "#c0392b" : "#e67e22";
}

// ─────────────────────────────────────────────────────────────────────────────
// salvarPedido(produtoId, quantidade, botao)
// Sem mudanças em relação à Aula 9.
// ─────────────────────────────────────────────────────────────────────────────
function salvarPedido(produtoId, quantidade, botao) {
  const card    = botao.parentElement;
  const nome    = card.querySelector("h3").textContent;
  const preco   = parseFloat(card.querySelector(".preco").getAttribute("data-preco"));
  const subtotal = preco * quantidade;

  const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  lista.push({ produto_id: produtoId, quantidade, nome, preco, subtotal });
  localStorage.setItem("techfood_pedidos", JSON.stringify(lista));

  botao.textContent           = "✓ Adicionado!";
  botao.style.backgroundColor = "#27ae60";
  atualizarContadorPedidos();

  setTimeout(function () {
    botao.textContent           = "Pedir Agora";
    botao.style.backgroundColor = "";
    botao.disabled              = false;
    const box = card.querySelector(".quantidade-box");
    if (box) {
      box.querySelector(".qtd-valor").textContent = "1";
      atualizarPrecoCard(box);
    }
  }, 1500);
}

// ─────────────────────────────────────────────────────────────────────────────
// atualizarContadorPedidos()
// Sem mudanças.
// ─────────────────────────────────────────────────────────────────────────────
function atualizarContadorPedidos() {
  const lista = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");
  const total = lista.reduce(function (acc, p) { return acc + p.quantidade; }, 0);
  const linkMenu = document.querySelector("#menu a[href='pedidos.html']");
  if (!linkMenu) return;
  let badge = linkMenu.querySelector(".badge-menu");
  if (!badge) {
    linkMenu.insertAdjacentHTML("beforeend", "<span class='badge-menu'>0</span>");
    badge = linkMenu.querySelector(".badge-menu");
  }
  badge.textContent = total;
  linkMenu.classList.add("menu-ativo");
}


// ─────────────────────────────────────────────────────────────────────────────
// inicializarSubtotal()                               DESATIVADA NA AULA 9
// Controlava #qtd-lasanha fixo no HTML da Aula 8.
// Aula 9+: grid é 100% dinâmico, elemento não existe mais.
// ─────────────────────────────────────────────────────────────────────────────
// function inicializarSubtotal() {
//   var inputQtd   = document.querySelector("#qtd-lasanha");
//   var precoTexto = document.querySelector("#preco-lasanha");
//   var subTexto   = document.querySelector("#sub-lasanha");
//   if (!inputQtd || !precoTexto) return;
//   inputQtd.addEventListener("input", function () {
//     var precoUnitario = 45.0;
//     var quantidade    = Number(inputQtd.value);
//     if (isNaN(quantidade) || quantidade < 1) return;
//     var total = quantidade * precoUnitario;
//     precoTexto.textContent = "R$ " + total.toFixed(2).replace(".", ",");
//     precoTexto.style.color = total > 150 ? "#c0392b" : "#e67e22";
//     if (subTexto) {
//       subTexto.textContent = quantidade > 1
//         ? quantidade + "x R$ " + precoUnitario.toFixed(2).replace(".", ",") : "";
//     }
//   });
// }
