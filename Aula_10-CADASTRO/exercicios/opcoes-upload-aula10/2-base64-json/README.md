# EcoCycle — Aula 10 — Variante 2: Base64 em JSON

> Use esta variante se o seu back **só lê JSON** (sem libs de upload).

## O que muda nesta variante

- `cadastro-eco.js`: usa **FileReader** para converter a imagem em string
  base64, e envia tudo como objeto JS normal.
- `api-eco.js`: `JSON.stringify` + `Content-Type: application/json`
  (padrão das outras funções).

## Como o back precisa ser

```js
app.use(express.json({ limit: "10mb" })); // pra aguentar base64 grande

app.post("/noticias", (req, res) => {
  const { titulo, resumo, categoria, imagem } = req.body;
  // imagem é string tipo "data:image/png;base64,iVBOR..."
  // Opção A: salvar a string direto no banco (LONGTEXT)
  // Opção B: decodificar com Buffer.from(base64, "base64") e salvar como arquivo
});
```

## Cuidados

- **Tamanho**: base64 incha o arquivo em ~33%. Aumente o `limit` do express.
- **Não use** `console.log(req.body)` no back — vai cuspir megabytes.
