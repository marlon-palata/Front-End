/* ==========================================================
   GLOBAL.JS — Funções compartilhadas por todas as páginas.

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — exibirBoasVindas(), exibirDataFooter(), fecharMenuAoNavegar()
   [✔] Aula 9  — solicitarNomeCliente() e exibirNomeCliente() adicionadas.
                 sessionStorage guarda o nome só enquanto a aba está aberta —
                 ideal para restaurante: cada sessão é um cliente novo na mesa.

   Carregado ANTES de qualquer script de página em todos os HTMLs.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  solicitarNomeCliente(); // NEW — exibe popup se ainda não tem nome na sessão
  exibirNomeCliente(); // NEW — atualiza saudação com o nome confirmado
  exibirBoasVindas();
  exibirDataFooter();
  fecharMenuAoNavegar();
});

// ─────────────────────────────────────────────────────────────────────────────
// solicitarNomeCliente()                                                  NEW
// Aula 9: exibe um modal pedindo o nome do cliente ao abrir o cardápio.
//
// sessionStorage vs localStorage:
//   localStorage  → persiste até o usuário limpar manualmente
//   sessionStorage → some ao fechar a aba — cada sessão é uma mesa nova
//   Perfeito para restaurante: o próximo cliente não vê o nome do anterior.
//
// trim() remove espaços em branco das bordas — evita nome " " (só espaço)
// passar em branco com espaços não dispara o !nome, então trim() é essencial.
//
// O setTimeout foca o input 100ms após o modal aparecer —
// sem o delay, o foco não funciona porque o display ainda está sendo aplicado.
// ─────────────────────────────────────────────────────────────────────────────
function solicitarNomeCliente() {
  // Se já tem nome na sessão, não exibe o popup de novo
  if (sessionStorage.getItem("techfood_cliente")) return;

  var modal = document.getElementById("modal-boas-vindas");
  if (modal) modal.style.display = "flex";

  var btnConfirmar = document.getElementById("btn-confirmar-nome");
  var inputNome = document.getElementById("input-nome-cliente");

  if (!btnConfirmar || !inputNome) return;

  btnConfirmar.addEventListener("click", function () {
    var nome = inputNome.value.trim();
    // Se o campo estiver vazio após o trim, foca e aborta
    if (!nome) {
      inputNome.focus();
      return;
    }

    // setItem salva o nome na sessão atual
    sessionStorage.setItem("techfood_cliente", nome);
    modal.style.display = "none";

    // Atualiza a saudação imediatamente após confirmar
    exibirNomeCliente();
  });

  // Permite confirmar com Enter além do botão
  inputNome.addEventListener("keydown", function (e) {
    if (e.key === "Enter") btnConfirmar.click();
  });

  // Foca no input automaticamente ao abrir o modal
  setTimeout(function () {
    inputNome.focus();
  }, 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// exibirNomeCliente()                                                     NEW
// Aula 9: personaliza a saudação com o nome do cliente salvo na sessão.
//   Se não tiver nome (primeira visita, antes do modal), exibe a saudação
//   genérica. Chamada após confirmar o nome no modal e no DOMContentLoaded.
// ─────────────────────────────────────────────────────────────────────────────
function exibirNomeCliente() {
  var nome = sessionStorage.getItem("techfood_cliente");
  var elemento = document.querySelector("#boas-vindas");
  if (!elemento) return;

  var agora = new Date();
  var hora = agora.getHours() + agora.getMinutes() / 60;
  var saudacao =
    hora < 12 ? "☀️ Bom dia" : hora < 18 ? "🌤️ Boa tarde" : "🌙 Boa noite";

  if (nome) {
    // Personaliza com o nome do cliente
    elemento.textContent = saudacao + ", " + nome + "! O que vai pedir hoje?";
  } else {
    elemento.textContent = saudacao + "! Qual o seu pedido?";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// exibirBoasVindas()
// Aula 8: saudação por horário com precisão de minutos (hora + minutos/60).
//   Na Aula 9 essa função ainda existe mas só é chamada como fallback —
//   exibirNomeCliente() assume o controle quando há nome na sessão.
// ─────────────────────────────────────────────────────────────────────────────
function exibirBoasVindas() {
  // Se já tem nome, exibirNomeCliente() já cuidou da saudação
  if (sessionStorage.getItem("techfood_cliente")) return;

  var agora = new Date();
  var hora = agora.getHours();
  var minutos = agora.getMinutes();
  var horaExata = hora + minutos / 60;

  var saudacao;
  if (horaExata >= 5 && horaExata < 12) {
    saudacao = "☀️ Bom dia! Qual o seu pedido?";
  } else if (horaExata >= 12 && horaExata < 18) {
    saudacao = "🌤️ Boa tarde! Confira nosso cardápio.";
  } else {
    saudacao = "🌙 Boa noite! Ainda dá tempo de pedir.";
  }

  var elemSaudacao = document.querySelector("#boas-vindas");
  if (elemSaudacao) elemSaudacao.textContent = saudacao;
}

// ─────────────────────────────────────────────────────────────────────────────
// exibirDataFooter()
// Aula 8: exibe a data atual no rodapé de todas as páginas. Sem mudanças.
// ─────────────────────────────────────────────────────────────────────────────
function exibirDataFooter() {
  var elemFooter = document.querySelector("#data-hora-footer");
  if (!elemFooter) return;

  var agora = new Date();
  var dataFormatada = agora.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  elemFooter.textContent = dataFormatada;
}

// ─────────────────────────────────────────────────────────────────────────────
// fecharMenuAoNavegar()
// Aula 8: fecha o menu hambúrguer no mobile ao clicar em link. Sem mudanças.
// ─────────────────────────────────────────────────────────────────────────────
function fecharMenuAoNavegar() {
  var isMobile = window.matchMedia("(max-width: 600px)").matches;
  if (!isMobile) return;

  var linksMenu = document.querySelectorAll("#menu a");
  linksMenu.forEach(function (link) {
    link.addEventListener("click", function () {
      var checkbox = document.querySelector("#bt_menu");
      if (checkbox) checkbox.checked = false;
    });
  });
}
