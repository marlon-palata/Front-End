/* ==========================================================
   API-ECO.JS — Comunicação com o servidor (EcoCycle - Aula 10)
   VARIANTE 2: Base64 em JSON
   ========================================================== */

var API_URL = "http://localhost:3000";

// ─────────────────────────────────────────────────────────────────────────────
// cadastrarNoticia(dados)
// POST /noticias — cadastra uma nova notícia.
//
// VARIANTE 2: Base64 dentro de JSON
// Aqui só viaja texto — a imagem foi convertida em string base64 pelo
// cadastro-eco.js. Por isso podemos usar JSON.stringify normal.
// ─────────────────────────────────────────────────────────────────────────────
async function cadastrarNoticia(dados) {
  var response = await fetch(API_URL + "/noticias", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  });
  var resposta = await response.json();
  if (!response.ok) throw new Error(resposta.erro || "Erro " + response.status);
  return resposta;
}
