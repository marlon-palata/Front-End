/* ==========================================================
   AULA 5: SELEÇÃO E MANIPULAÇÃO ESTÁTICA
   ========================================================== */

// NOVO: AULA 5 - Entendendo Window vs Document
// O window é o navegador. O document é a nossa página HTML.
console.log(window.location.href); // Mostra a URL atual

// NOVO: AULA 5 - Seletores (Old School vs New School)
const titulo = document.getElementById('titulo-site'); // Pelo ID direto
const saudacao = document.querySelector('#boas-vindas'); // Pelo seletor CSS (#)
const fotoPrato = document.querySelector('#foto-destaque');
const cardLasanha = document.querySelector('#card-lasanha');

// NOVO: AULA 5 - Manipulando Texto (textContent)
// Substituímos o alert da aula 4 por manipulação de texto na tela
const agora = new Date();
const hora = agora.getHours();
saudacao.textContent = (hora < 12) ? "Bom dia! Escolha seu almoço." : "Boa tarde! Confira o jantar.";

// NOVO: AULA 5 - Manipulando Atributos (setAttribute)
// Vamos mudar a foto do prato dinamicamente (simulando uma troca de destaque)
fotoPrato.setAttribute('alt', 'Destaque do Dia: Lasanha Bolonhesa');

// NOVO: AULA 5 - Manipulando Estilo (Método "Cru" .style)
// Mudando a cor do título direto pelo JS
titulo.style.color = "#e67e22"; 

// NOVO: AULA 5 - Manipulando Estilo (Método Profissional .classList)
// Adicionamos uma classe de destaque ao card que já deve estar no CSS
cardLasanha.classList.add('em-promocao');