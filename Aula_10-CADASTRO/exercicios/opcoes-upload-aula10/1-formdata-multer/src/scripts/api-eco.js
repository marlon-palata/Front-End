/* ==========================================================
   API-ECO.JS — Comunicação com o servidor (EcoCycle - Aula 10)
   VARIANTE 1: FormData + multer
   ========================================================== */

var API_URL = "http://localhost:3000";

// ─────────────────────────────────────────────────────────────────────────────
// cadastrarNoticia(dados)
// POST /noticias — cadastra uma nova notícia (com upload de imagem).
//
// VARIANTE 1: FormData (multipart/form-data)
// Envia texto + arquivo no mesmo pacote.
// ⚠ NÃO definir Content-Type — o navegador faz isso sozinho com o "boundary".
// ─────────────────────────────────────────────────────────────────────────────
async function cadastrarNoticia(dados) {
  var response = await fetch(API_URL + "/noticias", {
    method: "POST",
    body: dados, // FormData — SEM header Content-Type
  });
  var resposta = await response.json();
  if (!response.ok) throw new Error(resposta.erro || "Erro " + response.status);
  return resposta;
}
