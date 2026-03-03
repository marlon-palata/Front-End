/* ==========================================================
   AULA 5: DOM - EXERCÍCIOS ECOCYCLE
   ========================================================== */

// 1. SELEÇÃO DE ELEMENTOS (Aula 5)
const tituloPortal = document.querySelector("#titulo-portal");
const cardDestaque = document.querySelector("#card-destaque");

// 2. MANIPULAÇÃO ESTÁTICA (Aula 5)
tituloPortal.textContent = "EcoCycle - Portal Verde"; // Muda texto
tituloPortal.style.color = "#81c784"; // Estilo Cru (.style)
cardDestaque.classList.add("noticia-destaque"); // Estilo Profissional (.classList)

// 3. FUNÇÃO PARA ASSISTIR VÍDEO (Lógica Aula 4 + Manipulação Aula 5)
function verVideo() {
  // Selecionamos a imagem (thumbnail) que está na frente
  const thumb = document.querySelector("#thumb-video");

  // ONDE USAR: Escondemos a imagem para revelar o vídeo que está atrás
  thumb.style.display = "none";

  console.log("Thumbnail removida. O vídeo agora está visível.");
}
