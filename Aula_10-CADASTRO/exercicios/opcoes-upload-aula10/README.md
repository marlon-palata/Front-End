# EcoCycle — Aula 10 — 4 Variantes de Upload

Esta pasta tem **4 versões** do EcoCycle para a Aula 10. Cada uma usa uma
estratégia diferente para cadastrar uma notícia **com upload de imagem**.

| Pasta | Quando usar |
|---|---|
| `1-formdata-multer/` | Back usa **multer** (ou similar) — `multipart/form-data`. |
| `2-base64-json/`     | Back só lê JSON — sem libs de upload. |
| `3-url-externa/`     | Imagem hospedada em outro lugar (Imgur, Cloudinary). |
| `4-dois-requests/`   | Back tem 2 rotas: uma só pra upload, outra pra cadastrar. |

Cada pasta é **auto-contida** — tem o EcoCycle inteiro (com modal de
boas-vindas, lista de notícias estática, formulário de sugestão, simulador
de eco-economia) **mais** a seção nova de cadastro de notícia.

Como decidir qual variante usar: leia o `README.md` dentro de cada pasta.

## Como o EcoCycle se relaciona com o TechFood

A ideia é a mesma da Aula 9: o **TechFood** é o projeto fio-condutor (do
restaurante), e o **EcoCycle** é o paralelo (portal de notícias), pra você
exercitar os mesmos conceitos em um contexto diferente.

Aqui na Aula 10 você cadastra **notícias com foto** em vez de **pratos**.
A técnica de upload é a mesma — só muda o domínio.
