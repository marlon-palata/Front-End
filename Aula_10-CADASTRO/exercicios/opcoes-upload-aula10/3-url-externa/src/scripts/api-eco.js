/* ==========================================================
   API-ECO.JS — Comunicação com o servidor (EcoCycle - Aula 10)
   VARIANTE 3: URL externa
   ========================================================== */

var API_URL = "http://localhost:3000";

// ─────────────────────────────────────────────────────────────────────────────
// cadastrarNoticia(dados)
// POST /noticias — cadastra uma nova notícia.
//
// VARIANTE 3: URL externa
// A imagem é só uma string (URL pública). Função idêntica às outras:
// JSON.stringify + Content-Type JSON.
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
