/* ==========================================================
   GLOBAL.JS — Funções compartilhadas por todas as páginas.

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — exibirBoasVindas() com precisão de minutos (hora + min/60).
                 exibirDataFooter() e fecharMenuAoNavegar() (mobile).
   [✔] Aula 9  — solicitarNomeCliente(): modal de boas-vindas com sessionStorage.
                 exibirNomeCliente(): saudação personalizada com nome do cliente.
                 Conceito de sessão: sessionStorage some ao fechar a aba —
                 cada cliente (mesa) começa do zero.
   [ ] Aula 10 — atualizarContadorCadastro(): badge no link "Cadastrar Prato"
                 mostrando quantos pratos estão salvos no banco.
                 Requer que cadastro.js notifique global.js após salvar.
   [ ] Futuro  — Modo admin: ocultar/exibir "Cadastrar Prato" no menu
                 dependendo de autenticação (localStorage["techfood_admin"]).

   Carregado ANTES de qualquer script de página em todos os HTMLs.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  solicitarNomeCliente(); // NEW — exibe popup se ainda não tem nome na sessão
  exibirNomeCliente();    // NEW — atualiza saudação com o nome confirmado
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
  if (sessionStorage.getItem("techfood_cliente")) return;

  const modal = document.getElementById("modal-boas-vindas");
  if (modal) modal.style.display = "flex";

  const btnConfirmar = document.getElementById("btn-confirmar-nome");
  const inputNome    = document.getElementById("input-nome-cliente");

  if (!btnConfirmar || !inputNome) return;

  btnConfirmar.addEventListener("click", function () {
    const nome = inputNome.value.trim();
    if (!nome) {
      inputNome.focus();
      return;
    }
    sessionStorage.setItem("techfood_cliente", nome);
    modal.style.display = "none";
    exibirNomeCliente();
  });

  inputNome.addEventListener("keydown", function (e) {
    if (e.key === "Enter") btnConfirmar.click();
  });

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
  const nome     = sessionStorage.getItem("techfood_cliente");
  const elemento = document.querySelector("#boas-vindas");
  if (!elemento) return;

  const agora    = new Date();
  const hora     = agora.getHours() + agora.getMinutes() / 60;
  const saudacao = hora < 12 ? "☀️ Bom dia" : hora < 18 ? "🌤️ Boa tarde" : "🌙 Boa noite";

  elemento.textContent = nome
    ? `${saudacao}, ${nome}! O que vai pedir hoje?`
    : `${saudacao}! Qual o seu pedido?`;
}

// ─────────────────────────────────────────────────────────────────────────────
// exibirBoasVindas()
// Aula 8: saudação por horário com precisão de minutos (hora + minutos/60).
//   Na Aula 9 esta função ainda existe mas só é chamada como fallback —
//   exibirNomeCliente() assume o controle quando há nome na sessão.
// ─────────────────────────────────────────────────────────────────────────────
function exibirBoasVindas() {
  if (sessionStorage.getItem("techfood_cliente")) return;

  const agora    = new Date();
  const horaExata = agora.getHours() + agora.getMinutes() / 60;

  let saudacao;
  if (horaExata >= 5 && horaExata < 12) {
    saudacao = "☀️ Bom dia! Qual o seu pedido?";
  } else if (horaExata >= 12 && horaExata < 18) {
    saudacao = "🌤️ Boa tarde! Confira nosso cardápio.";
  } else {
    saudacao = "🌙 Boa noite! Ainda dá tempo de pedir.";
  }

  const elemSaudacao = document.querySelector("#boas-vindas");
  if (elemSaudacao) elemSaudacao.textContent = saudacao;
}

// ─────────────────────────────────────────────────────────────────────────────
// exibirDataFooter()
// Aula 8: exibe a data atual no rodapé de todas as páginas. Sem mudanças.
// ─────────────────────────────────────────────────────────────────────────────
function exibirDataFooter() {
  const elemFooter = document.querySelector("#data-hora-footer");
  if (!elemFooter) return;

  const agora = new Date();
  elemFooter.textContent = agora.toLocaleDateString("pt-BR", {
    weekday: "long",
    year:    "numeric",
    month:   "long",
    day:     "numeric",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// fecharMenuAoNavegar()
// Aula 8: fecha o menu hambúrguer no mobile ao clicar em link. Sem mudanças.
// ─────────────────────────────────────────────────────────────────────────────
function fecharMenuAoNavegar() {
  const isMobile = window.matchMedia("(max-width: 600px)").matches;
  if (!isMobile) return;

  const linksMenu = document.querySelectorAll("#menu a");
  linksMenu.forEach(function (link) {
    link.addEventListener("click", function () {
      const checkbox = document.querySelector("#bt_menu");
      if (checkbox) checkbox.checked = false;
    });
  });
}
