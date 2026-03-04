/* ==========================================================
   AULA 5: DOM - SELEÇÃO E MANIPULAÇÃO ESTÁTICA
   ========================================================== */

// 1. HIERARQUIA GLOBAL (Slide 2)
// window: Representa a janela do navegador (o "Pai" de tudo).
// document: Representa o seu HTML (o "Filho" focado no conteúdo).
console.log("URL da página (via window):", window.location.href);
console.log("Título da aba (via document):", document.title);


// 2. SELETORES "OLD SCHOOL" (Slide 3)
// getElementById: Busca rápida e exclusiva por ID.
const tituloPrincipal = document.getElementById('titulo-site');


// 3. SELETORES "NEW SCHOOL" - querySelector (Slides 4, 5 e 6)
// O padrão moderno que utiliza seletores CSS para encontrar elementos.

// A) Seleção Simples (ID e Classe)
const saudacao = document.querySelector('#boas-vindas'); // ID (#)
const primeiroBotao = document.querySelector('.btn-pedido'); // Classe (.)

// B) Seleção por Hierarquia (Pai > Filho)
// ONDE: Busca o h3 que está especificamente dentro do card de ID 'card-lasanha'.
const nomeLasanha = document.querySelector('#card-lasanha h3');

// C) Seleção por Posição (Pseudo-classes)
// ONDE: Busca o primeiro elemento com a classe 'card' na estrutura.
const cardDestaque = document.querySelector('.card:nth-of-type(1)');

// D) Seleção por Atributo
// ONDE: Busca uma imagem que possua o atributo 'alt' exatamente com este texto.
const imgLasanha = document.querySelector('img[alt="Lasanha Tech"]');


// 4. SELETORES DE COLEÇÃO (Slide 7)
// querySelectorAll: Captura todos os itens de uma vez e gera uma NodeList (lista).
const todosOsCards = document.querySelectorAll('.card');
console.log("Total de cards na vitrine:", todosOsCards.length);


// 5. MANIPULAÇÃO DE CONTEÚDO (Slide 8)
// textContent: Altera apenas o texto visível. É o método mais seguro e performático.
const horaAtual = new Date().getHours();
saudacao.textContent = (horaAtual < 12) ? "Bom dia! Veja nossas massas." : "Boa tarde! Que tal uma pizza?";


// 6. MANIPULAÇÃO DE ATRIBUTOS (Slide 11)
// Existem duas formas de alterar atributos como src, alt, title e href.

// VERSÃO STANDARD (Tradicional):
imgLasanha.setAttribute('title', 'Nossa famosa massa artesanal');

// VERSÃO MODERNA (Acesso Direto à Propriedade):
// POR QUE: Mais curto, legível e preferido por desenvolvedores experientes.
imgLasanha.src = "src/images/lasanha-destaque.png"; // Altera o caminho da imagem
imgLasanha.alt = "Foto da Lasanha Bolonhesa em Destaque"; // Altera o texto alternativo


// 7. MANIPULAÇÃO DE ESTILO - MÉTODO "CRU" (.style) (Slide 13)
// ONDE USAR: Mudanças rápidas e pontuais que geram estilo inline no HTML.
// NOTA: Propriedades CSS com hífen viram camelCase (ex: border-bottom -> borderBottom).
tituloPrincipal.style.color = "#e67e22"; 
tituloPrincipal.style.borderBottom = "3px solid #2c3e50";


// 8. MANIPULAÇÃO DE ESTILO - MÉTODO PROFISSIONAL (.classList) (Slide 14)
// ONDE USAR: Aplicar regras complexas de design que já estão no seu arquivo CSS.
// POR QUE: É a melhor prática, pois separa o Visual (CSS) da Lógica (JS).
cardDestaque.classList.add('em-promocao');

console.log("Manipulação DOM Aula 5: Concluída com sucesso!");
