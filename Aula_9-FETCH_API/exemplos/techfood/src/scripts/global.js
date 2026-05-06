/* ==========================================================
   GLOBAL.JS — Funções compartilhadas por todas as páginas.

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — Criado: saudação, data do footer, fechar menu.
   [✔] Aula 9  — solicitarNomeCliente() e exibirNomeCliente():
                 popup de boas-vindas com sessionStorage.
                 sessionStorage: dura só a sessão — ideal para
                 restaurante, onde cada visita é um cliente novo.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  solicitarNomeCliente();
  exibirNomeCliente();
  exibirBoasVindas();
  exibirDataFooter();
  fecharMenuAoNavegar();
});


// ─────────────────────────────────────────────────────────────────────────────
// solicitarNomeCliente()
// Aula 9: exibe o modal de boas-vindas se ainda não há nome na sessão.
//
// sessionStorage.getItem retorna null se a chave não existe —
// usamos isso para saber se é a primeira visita da sessão.
// ─────────────────────────────────────────────────────────────────────────────
function solicitarNomeCliente() {
  if (sessionStorage.getItem("techfood_cliente")) return;

  var modal = document.getElementById("modal-boas-vindas");
  if (modal) modal.style.display = "flex";

  var btnConfirmar = document.getElementById("btn-confirmar-nome");
  var inputNome    = document.getElementById("input-nome-cliente");

  if (!btnConfirmar || !inputNome) return;

  btnConfirmar.addEventListener("click", function () {
    var nome = inputNome.value.trim();
    if (!nome) { inputNome.focus(); return; }

    // salva o nome na sessão atual — some ao fechar a aba
    sessionStorage.setItem("techfood_cliente", nome);
    modal.style.display = "none";

    // atualiza a saudação imediatamente após confirmar
    exibirNomeCliente();
  });

  // permite confirmar com Enter além do botão
  inputNome.addEventListener("keydown", function (e) {
    if (e.key === "Enter") btnConfirmar.click();
  });

  // foca no input automaticamente ao abrir o modal
  setTimeout(function () { inputNome.focus(); }, 100);
}


// ─────────────────────────────────────────────────────────────────────────────
// exibirNomeCliente()
// Aula 9: personaliza a saudação com o nome do cliente.
// Se o nome ainda não existe (modal aberto), exibe saudação genérica.
// ─────────────────────────────────────────────────────────────────────────────
function exibirNomeCliente() {
  var nome     = sessionStorage.getItem("techfood_cliente");
  var elemento = document.querySelector("#boas-vindas");
  if (!elemento) return;

  var agora    = new Date();
  var hora     = agora.getHours() + agora.getMinutes() / 60;
  var saudacao = hora < 12 ? "☀️ Bom dia" : hora < 18 ? "🌤️ Boa tarde" : "🌙 Boa noite";

  if (nome) {
    elemento.textContent = saudacao + ", " + nome + "! O que vai pedir hoje?";
  } else {
    elemento.textContent = saudacao + "! Qual o seu pedido?";
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// exibirBoasVindas()
// Aula 8: saudação genérica — mantida como fallback quando
// o nome ainda não foi confirmado no modal.
// ─────────────────────────────────────────────────────────────────────────────
function exibirBoasVindas() {
  var elemento = document.querySelector("#boas-vindas");
  if (!elemento || sessionStorage.getItem("techfood_cliente")) return;

  var agora     = new Date();
  var horaExata = agora.getHours() + agora.getMinutes() / 60;
  var saudacao;

  if (horaExata >= 5 && horaExata < 12) {
    saudacao = "☀️ Bom dia! Qual o seu pedido?";
  } else if (horaExata >= 12 && horaExata < 18) {
    saudacao = "🌤️ Boa tarde! Confira nosso cardápio.";
  } else {
    saudacao = "🌙 Boa noite! Ainda dá tempo de pedir.";
  }

  elemento.textContent = saudacao;
}


// ─────────────────────────────────────────────────────────────────────────────
// exibirDataFooter() — mantido da Aula 8
// ─────────────────────────────────────────────────────────────────────────────
function exibirDataFooter() {
  var elemFooter = document.querySelector("#data-hora-footer");
  if (!elemFooter) return;

  var agora = new Date();
  elemFooter.textContent = agora.toLocaleDateString("pt-BR", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric"
  });
}


// ─────────────────────────────────────────────────────────────────────────────
// fecharMenuAoNavegar() — mantido da Aula 8
// ─────────────────────────────────────────────────────────────────────────────
function fecharMenuAoNavegar() {
  var isMobile = window.matchMedia("(max-width: 600px)").matches;
  if (!isMobile) return;

  document.querySelectorAll("#menu a").forEach(function (link) {
    link.addEventListener("click", function () {
      var checkbox = document.querySelector("#bt_menu");
      if (checkbox) checkbox.checked = false;
    });
  });
}