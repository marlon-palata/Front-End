/* ==========================================================
   PEDIDOS.JS — Lógica da página de Pedidos (pedidos.html)

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — Criado: adicionarItemAoResumo() e o botão Limpar
                 migraram do aula7.js para cá e evoluíram.
                 Em vez de criar itens na mesma página do cardápio,
                 agora lemos do localStorage e exibimos em pedidos.html.
   [ ] Futuro  — Substituir localStorage por chamadas à API (back-end)
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  renderizarPedidos();
  configurarLimparPedidos();
});


// ─────────────────────────────────────────────────────────────────────────────
// renderizarPedidos()
// Aula 7: adicionarItemAoResumo() criava um <li> por clique na mesma
//   página do cardápio — createElement + appendChild em tempo real.
//
// Aula 8: migrou para cá e evoluiu. Agora lemos TODOS os pedidos
//   do localStorage de uma vez ao abrir pedidos.html e montamos
//   a lista completa. O mesmo createElement + appendChild da Aula 7
//   continua aqui — mesma técnica, contexto diferente.
//
// reduce(): percorre o array acumulando um resultado.
//   Aqui soma as quantidades de todos os pedidos para o contador.
//   Funciona como um forEach, mas devolve um único valor ao final.
// ─────────────────────────────────────────────────────────────────────────────
function renderizarPedidos() {
  const lista        = document.querySelector("#lista-pedidos");
  const spanTotal    = document.querySelector("#valor-total");
  const spanResumo   = document.querySelector("#valor-total-resumo");
  const spanContador = document.querySelector("#contador-itens");

  if (!lista) return;

  // Padrão seguro: || "[]" evita JSON.parse(null) que lançaria erro
  const pedidos = JSON.parse(localStorage.getItem("techfood_pedidos") || "[]");

  if (pedidos.length === 0) {
    lista.innerHTML =
      "<li class='pedido-vazio'>Nenhum pedido ainda. Acesse o " +
      "<a href='index.html'>Cardápio</a> para adicionar! 😊</li>";
    return;
  }

  // Limpa antes de renderizar — evita duplicatas se chamada mais de uma vez
  lista.innerHTML = "";
  let total = 0;

  pedidos.forEach(function (pedido) {
    // createElement + appendChild — Aula 7, mesmo padrão, nova página
    const li = document.createElement("li");
    li.classList.add("item-pedido");
    li.innerHTML =
      "<strong>" + pedido.nome + "</strong>" +
      " — " + pedido.qtd + "x" +
      " R$ " + pedido.preco.toFixed(2).replace(".", ",") +
      " = <span class='subtotal-item'>R$ " +
      pedido.subtotal.toFixed(2).replace(".", ",") + "</span>";

    lista.appendChild(li);
    total += pedido.subtotal;
  });

  const totalFmt = "R$ " + total.toFixed(2).replace(".", ",");
  if (spanTotal)  spanTotal.textContent  = totalFmt;
  if (spanResumo) spanResumo.textContent = totalFmt;

  // reduce acumula as quantidades — devolve o total de itens
  const totalItens = pedidos.reduce(function (acc, p) { return acc + p.qtd; }, 0);
  if (spanContador) {
    spanContador.textContent = totalItens + (totalItens === 1 ? " item" : " itens");
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// configurarLimparPedidos()
// Aula 7: o botão Limpar estava como código SOLTO no aula7.js —
//   usava um loop firstElementChild + remove() para esvaziar a lista
//   na mesma página.
//
// Aula 8: virou função, migrou para cá e evoluiu.
//   Em vez de remover elementos do DOM um por um, removemos a chave
//   do localStorage e re-renderizamos — mais simples e correto
//   para o novo contexto de página dedicada.
//
//   removeItem("chave") é mais preciso que clear():
//   remove só os pedidos, sem apagar pratos cadastrados
//   ou qualquer outra chave futura do projeto.
// ─────────────────────────────────────────────────────────────────────────────
function configurarLimparPedidos() {
  const btn = document.querySelector("#btn-limpar-pedidos");
  if (!btn) return;

  btn.addEventListener("click", function () {
    localStorage.removeItem("techfood_pedidos");
    renderizarPedidos();
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// [ ] Futuro — Integração com Back-end
// Quando o servidor estiver pronto, o localStorage dá lugar ao fetch().
// A lógica de exibição permanece igual — só muda a origem dos dados.
// ─────────────────────────────────────────────────────────────────────────────
//
// function renderizarPedidos() {
//   fetch("https://api.techfood.com/pedidos")
//     .then(function(res) { return res.json(); })
//     .then(function(pedidos) {
//       // mesma lógica de exibição acima
//     })
//     .catch(function(err) { console.error("Erro ao buscar pedidos:", err); });
// }