/* ==========================================================
   AULA 06: EVENTOS DOM - TECHFOOD
   CORREÇÃO: Eventos aplicados para funcionar em todos os dispositivos
   ========================================================== */

// 1. SAUDAÇÃO DINÂMICA (Base Aula 5)
const saudacao = document.querySelector("#boas-vindas");
const hora = new Date().getHours();
if (saudacao) {
    saudacao.textContent =
        hora < 12
            ? "Bom dia! Qual o seu pedido?"
            : "Boa tarde! Confira nosso cardápio.";
}

// 2. CÁLCULO DE PREÇO DINÂMICO (Aula 6)
const inputQtd = document.querySelector("#qtd-lasanha");
const precoTexto = document.querySelector("#preco-lasanha");

if (inputQtd && precoTexto) {
    inputQtd.addEventListener("input", () => {
        const precoUnitario = 45.0;
        const total = Number(inputQtd.value) * precoUnitario;
        precoTexto.textContent = `R$ ${total.toFixed(2)}`;

        // Mudança sutil de cor se o valor for alto (Feedback Visual Aula 6)
        precoTexto.style.color = total > 150 ? "#c0392b" : "#e67e22";
    });
}

// 3. EVENTO DE CLIQUE PARA TODOS OS BOTÕES (Mobile e Desktop)
// Usamos querySelectorAll para garantir que todos os botões da página funcionem.
const botoesPedido = document.querySelectorAll(".btn-pedido");

botoesPedido.forEach((botao) => {
    // Usamos 'click' que é universal para mouse e touch
    botao.addEventListener("click", (event) => {
        // Evita qualquer comportamento padrão do navegador
        event.preventDefault();

        const nomePrato = botao.parentElement.querySelector("h3").textContent;
        alert(
            `🥘 Sucesso! Seu pedido de "${nomePrato}" foi enviado para a cozinha.`,
        );

        // Efeito visual no botão após clique
        botao.textContent = "✓ Pedido Enviado";
        botao.style.backgroundColor = "#27ae60"; // Verde Sucesso
        botao.disabled = true;
    });
});

// 4. INTERATIVIDADE NOS CARDS (Feedback visual)
const cards = document.querySelectorAll(".card");
cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
        card.style.transform = "translateY(-5px)";
        card.style.boxShadow = "0 10px 20px rgba(0,0,0,0.1)";
    });
    card.addEventListener("mouseleave", () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "none";
    });
});
