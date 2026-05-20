# Documentação da API - Cantina Bella Vita

Esta documentação é destinada à equipe de frontend para integração com a API da Cantina Bella Vita. 
A API Rest fornece endpoints completos para gerenciar **Produtos**, **Cardápios** e **Pedidos**.

> **Base URL:** `http://localhost:3000` (ou a URL de produção/homologação quando disponível) \
> **Content-Type:** Todas as requisições e respostas com corpo utilizam padrão `application/json`.

---

## 1. Informações da API
**`GET /`** \
Retorna o status atual da aplicação.

**Resposta de Sucesso (200 OK):**
```json
{
    "mensagem": "API Cantina Bella Vita funcionando 🍝",
    "versao": "1.0.0",
    "arquitetura": "MVC + SOLID (Refatorada)"
}
```

### **Formato de Retorno de Erros (400, 404, 500)**
O backend sempre retorna os erros (ex: `404 Not Found` quando um item não é encontrado, ou `400 Bad Request` quando uma regra de validação falha) em um corpo JSON padronizado através da propriedade `"erro"`. A equipe deve escutar esta propriedade para mostrar os alertas na tela.

**Exemplo de Resposta de Erro:**
```json
{
    "erro": "Pedido não encontrado."
}
```

---

## 2. Produtos
Rotas para gerenciar pratos e bebidas individuais do restaurante.

### **Listar Produtos**
**`GET /produtos`** \
Retorna a lista de todos os produtos ativos e inativos.

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "nome": "Espaguete à Bolonhesa",
    "descricao": "Massa com molho...",
    "preco": "35.50",
    "categoria": "Massa",
    "disponivel": 1,
    "criado_em": "...",
    "atualizado_em": "..."
  }
]
```

### **Buscar Produto Específico**
**`GET /produtos/:id`** \
Busca detalhes de um produto pelo seu [id](file:///c:/Users/Instrutor/Desktop/Somativa/src/services/PedidoService.js#5-48).
- **404 Not Found:** Quando o ID não existe.

### **Cadastrar Produto**
**`POST /produtos`** \
Endpoint para adicionar um novo produto ao banco de dados.

**Body Mínimo Esperado:**
```json
{
  "nome": "Suco de Uva",
  "descricao": "Copo 500ml",
  "preco": 10.50,
  "categoria": "Bebida",
  "disponivel": true
}
```

### **Atualizar Produto**
**`PUT /produtos/:id`** \
Atualiza completamente os dados de um determinado produto. O formato do corpo é igual à rota `POST /produtos`.

### **Deletar Produto**
**`DELETE /produtos/:id`** \
Evite caso o produto esteja vinculado a um pedido histórico devido a restrições no banco. Retorna mensagem de sucesso.

---

## 3. Cardápios
Rotas para gerenciar menus combinados (Ex: "Menu do Dia", associando vários produtos a um cardápio).

### **Listar Cardápios**
**`GET /cardapios`** \
Retorna todos os cardápios (sem a listagem profunda de produtos envolvidos).

### **Buscar Cardápio e Produtos Relacionados**
**`GET /cardapios/:id`** \
Lista os detalhes do cardápio solicitado e traz uma key `"produtos"` populada com todos os itens pertencentes a este cardápio.

**Resposta (200 OK):**
```json
{
  "id": 1,
  "nome": "Combo Família",
  "descricao": "Massa tamanho família e refrigerante",
  "disponivel": 1,
  "produtos": [
    {
      "id": 1,
      "nome": "Espaguete à Bolonhesa",
      "preco": "35.50"
    }
  ]
}
```

### **Cadastrar Cardápio**
**`POST /cardapios`** \
Cria um agrupamento de cardápio passando os dados principais dele e um array de IDs que represetam os produtos vinculados.

**Body:**
```json
{
  "nome": "Menu Executivo",
  "descricao": "Almoço individual de segunda à sexta",
  "disponivel": true,
  "produtosIds": [1, 4]
}
```

### **Deletar Cardápio**
**`DELETE /cardapios/:id`** \
Apaga o cardápio (os vínculos com o produto e os próprios produtos não são apagados permanentemente).

---

## 4. Pedidos (Caixa / PDV / Atendimento)
As rotas de pedidos efetuam as ordens. A lógica é focada em validar o que foi escolhido do painel de produtos e calcular o total no back-end, impedindo manipulação fácil de somatórias no front-end.

### **Criar um Pedido**
**`POST /pedidos`** \
Abre um novo pedido enviando quem pediu e uma lista detalhada de quantos itens e qual o ID deles.

**Body Esperado:**
```json
{
  "cliente": "João da Silva",
  "itens": [
    {
      "produto_id": 1,
      "quantidade": 2
    },
    {
      "produto_id": 4,
      "quantidade": 1
    }
  ]
}
```
*Atenção: Não envie o `total` pago. O cálculo monetário é feito automaticamente no Backend via banco de dados.*

**Resposta de Sucesso (201 Created):**
Retorna a chave `"pedido"` com o id gerado e o total recém calculado.

### **Listar Pedidos**
**`GET /pedidos`** \
Traz as informações gerais de estado para montar boards do tipo Kanban ou listagens (Ex: O que está Pendente, O que está Pronto).

### **Detalhes do Pedido com Sub-itens**
**`GET /pedidos/:id`** \
Utilizado para expandir todas as informaçõs quando o usuário clicar num card de Pedido da lista. Ele traz o Pedido + itens com nome do produto do banco cruzado.

**Resposta do Objeto (200 OK):**
```json
{
  "id": 1,
  "cliente": "João da Silva",
  "status": "pendente",
  "total": "83.00",
  "itens": [
    {
      "id": 1,
      "pedido_id": 1,
      "produto_id": 1,
      "quantidade": 2,
      "preco_unitario": "35.50",
      "produto_nome": "Espaguete à Bolonhesa",
      "produto_descricao": "Massa com molho..."
    }
  ]
}
```

### **Atualizar Status do Pedido (Ex: Mover no Kanban)**
**`PATCH /pedidos/:id/status`** \
Rota simples destinada aos entregadores ou cozinheiros, apenas para evoluir a etapa do preparo.

- **Status aceitos textualmente:** `"pendente"`, `"preparo"`, `"pronto"`, `"entregue"`.

**Body Esperado:**
```json
{
  "status": "preparo"
}
```

### **Cancelar/Deletar Pedido**
**`DELETE /pedidos/:id`** \
Remove completamente o pedido e estorna seus itens.
