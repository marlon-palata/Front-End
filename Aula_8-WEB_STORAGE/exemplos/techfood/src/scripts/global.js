/* ==========================================================
   GLOBAL.JS — Funções compartilhadas por todas as páginas.

   ROADMAP DESTE ARQUIVO:
   [✔] Aula 8  — Criado: saudação, data do footer e menu mobile
                 migraram do aula7.js para cá porque o projeto
                 agora tem múltiplas páginas (index, cadastro, pedidos).
                 O que é de todas as páginas não pode viver num arquivo
                 que só carrega em uma delas.

   Carregado ANTES de qualquer script de página em todos os HTMLs.
   ========================================================== */

document.addEventListener("DOMContentLoaded", function () {
  exibirBoasVindas();
  exibirDataFooter();
  fecharMenuAoNavegar();
});

// ─────────────────────────────────────────────────────────────────────────────
// exibirBoasVindas()
// Aula 7: estava como código SOLTO no aula7.js — comparava só getHours()
//   e só funcionava no index.html.
//
// Aula 8: virou função, migrou para cá e evoluiu.
//   hora + minutos/60 gera um valor decimal preciso:
//   12:30 → 12.5 → "Boa tarde" corretamente.
//   Só getHours() faria 12:01 e 12:59 parecerem iguais (ambos = 12).
//
//   Agora roda em index.html, cadastro.html e pedidos.html —
//   as três páginas têm o mesmo #boas-vindas no header.
// ─────────────────────────────────────────────────────────────────────────────
function exibirBoasVindas() {
  const agora = new Date();
  const hora = agora.getHours();
  const minutos = agora.getMinutes();
  const horaExata = hora + minutos / 60;

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
// Aula 8: exibe a data atual no rodapé de todas as páginas.
//   O #data-hora-footer existe em index.html, cadastro.html e pedidos.html.
//
// toLocaleDateString com opções formata em português completo:
//   "quinta-feira, 12 de março de 2026"
// ─────────────────────────────────────────────────────────────────────────────
function exibirDataFooter() {
  const elemFooter = document.querySelector("#data-hora-footer");
  if (!elemFooter) return;

  const agora = new Date();
  const dataFormatada = agora.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  elemFooter.textContent = dataFormatada;
}

// ─────────────────────────────────────────────────────────────────────────────
// fecharMenuAoNavegar()
// Aula 3 (Design Responsivo): no mobile, fecha o menu hambúrguer
//   automaticamente ao clicar em qualquer link de navegação.
//
// window.matchMedia verifica se uma media query CSS está ativa —
//   a mesma lógica do @media (max-width: 600px) do CSS, acessível pelo JS.
//   Se não for mobile, encerra sem adicionar eventos desnecessários.
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
