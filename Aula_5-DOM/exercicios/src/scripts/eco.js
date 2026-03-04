/* ==========================================================
   AULA 5: DOM - SELEÇÃO E MANIPULAÇÃO ESTÁTICA (ECOCYCLE)
   ========================================================== */

// 1. HIERARQUIA GLOBAL (Slide 2)
// ONDE: Verificar metadados ou informações do navegador.
// POR QUE: Para entender que o 'document' é apenas uma parte da janela ('window').
console.log("Largura da Janela do Aluno:", window.innerWidth);
console.log("Título atual da aba:", document.title);


// 2. SELETORES "OLD SCHOOL" (Slide 3)
// ONDE: Quando o elemento possui um ID único e queremos busca direta.
const tituloPortal = document.getElementById('titulo-portal');


// 3. SELETORES "NEW SCHOOL" - querySelector (Slides 4, 5 e 6)
// ONDE: O padrão moderno. Permite usar qualquer regra de CSS.

// A) Seleção Simples (ID e Classe)
const cardDestaque = document.querySelector('#card-destaque'); // ID (#)
const primeiroBotao = document.querySelector('.btn-leitura');  // Classe (.)

// B) Seleção por Hierarquia (Pai > Filho)
// ONDE: Busca o h2 que está especificamente dentro do card de ID 'card-destaque'.
const tituloNoticiaDestaque = document.querySelector('#card-destaque h2');

// C) Seleção por Posição (Pseudo-classes)
// ONDE: Busca o segundo card de notícia da lista.
const segundoCard = document.querySelector('.card-noticia:nth-of-type(2)');

// D) Seleção por Atributo
// ONDE: Busca a imagem pelo texto alternativo (alt).
const imgThumbnail = document.querySelector('img[alt="Thumbnail"]');


// 4. SELETORES DE COLEÇÃO (Slide 7)
// querySelectorAll: Captura todos os itens de uma vez e gera uma lista (NodeList).
const todosBotoes = document.querySelectorAll('.btn-leitura');
console.log("Total de notícias no portal:", todosBotoes.length);


// 5. MANIPULAÇÃO DE CONTEÚDO (Slide 8)
// textContent: Altera o texto de forma segura.
tituloPortal.textContent = "EcoCycle - Portal de Sustentabilidade";


// 6. MANIPULAÇÃO DE ATRIBUTOS (VERSÃO MODERNA) (Slide 11)
// ONDE: Trocar imagens, links ou acessibilidade.
// POR QUE: Acesso direto à propriedade é mais rápido e legível que setAttribute.

// Mudando o Alt (Acessibilidade)
imgThumbnail.alt = "Capa do vídeo sobre Energia Solar"; 

// Mudando o Título (Balão ao passar o mouse)
imgThumbnail.title = "Clique no botão 'Assistir' abaixo";


// 7. MANIPULAÇÃO DE ESTILO - MÉTODO "CRU" (.style) (Slide 13)
// ONDE USAR: Mudanças rápidas e pontuais (Estilo Inline).
tituloPortal.style.color = "#81c784"; 
tituloPortal.style.letterSpacing = "2px";


// 8. MANIPULAÇÃO DE ESTILO - MÉTODO PROFISSIONAL (.classList) (Slide 14)
// ONDE USAR: Aplicar regras complexas que já estão no seu CSS.
// POR QUE: É a melhor prática. Ativa a classe '.noticia-destaque' do seu arquivo CSS.
cardDestaque.classList.add('noticia-destaque');


/* ==========================================================
   LÓGICA DA AULA 4 APLICADA AO DOM (FUNÇÃO DE CLIQUE)
   ========================================================== */

// Esta função é chamada pelo 'onclick' no HTML do botão Assistir
function verVideo() {
    const thumb = document.querySelector('#thumb-video');
    
    // ONDE: Escondemos a imagem para revelar o iframe que está no fundo (z-index 1)
    // POR QUE: Resolve o Erro 153 do YouTube que acontece por sobreposição.
    thumb.style.display = "none";
    
    console.log("Ação: Usuário clicou em assistir. Thumbnail removida via DOM.");
}
