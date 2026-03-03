// --- SELEÇÃO DE ELEMENTOS (Seu código base) ---

// Busca o elemento único pelo ID. O DOM entrega o objeto completo da tag <header>.
const topo = document.getElementById("topo-loja");

// Busca todos os elementos com a classe 'card'. O DOM entrega uma lista (HTMLCollection).
const listaCards = document.getElementsByClassName("card");

// Busca todas as tags <a> do documento. Também entrega uma lista (HTMLCollection).
const links = document.getElementsByTagName("a");

// --- EXIBIÇÃO BÁSICA ---
console.log("1. O elemento topo:", topo);
console.log("2. O primeiro card da lista:", listaCards[0]);
console.log("3. A lista completa de links:", links);
console.log("4. O endereço (URL) do primeiro link:", links[0].href);
console.log("5. A cor do cabeçalho:", topo.style.backgroundColor);

// Pega todos os estilos que o navegador calculou para o topo
const estilosReais = window.getComputedStyle(topo);
console.log("5. A cor real do cabeçalho (do CSS):", estilosReais.backgroundColor);


console.log("=== EXPLORANDO PROPRIEDADES VISUAIS ===");

// 5. INNERTEXT vs INNERHTML
// Use innerText para pegar apenas o texto. Use innerHTML se quiser ver as tags que estão dentro.
console.log("Texto do cabeçalho:", topo.innerText); 
console.log("HTML interno do cabeçalho:", topo.innerHTML);

// 6. MANIPULAÇÃO DE ATRIBUTOS
// O DOM permite acessar qualquer atributo (src, alt, value, etc.)
const fotoLasanha = listaCards[0].getElementsByTagName("img")[0];
console.log("URL da imagem do card:", fotoLasanha.src);

// 7. MEDIDAS REAIS (LAYOUT)
// offsetWidth e offsetHeight pegam a largura e altura real que o elemento ocupa na tela (em pixels).
console.log("Largura real do topo na tela:", topo.offsetWidth + "px");

// 8. ESTADOS DE INPUT
// Útil para explicar lógica de menus. Verifica se o checkbox está marcado.
const checkbox = document.getElementById("bt_menu");
console.log("O menu lateral está ativado?:", checkbox.checked);

// 9. LISTA DE CLASSES (classList)
// Mostra todas as classes que o elemento possui.
console.log("Classes do card:", listaCards[0].classList);


// --- EXPLICAÇÃO: console.log vs console.dir ---

// O console.log(topo) mostra a representação da árvore HTML (bonitinho para ler o código).
console.log("LOG do elemento (visão HTML):", topo);

// O console.dir(topo) mostra o elemento como um OBJETO JavaScript puro.
// É aqui que o aluno vê que o 'topo' tem centenas de propriedades (style, children, id, etc.)
console.dir(topo);