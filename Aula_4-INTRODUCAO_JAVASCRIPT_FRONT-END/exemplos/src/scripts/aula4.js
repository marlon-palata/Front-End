// 1. ORIENTAÇÃO A OBJETOS (Slide 15)
// Criando o "molde" para os pratos do TechFood
class Prato {
    constructor(nome, preco) {
        this.nome = nome;
        this.preco = preco;
    }
    // (Slide 16)
     exibirComMoeda() {
        return "R$ " + this.preco.toFixed(2);
    }
}

// 2. INTERAÇÃO INICIAL (Slide 17)
// O prompt captura o dado do usuário como String
alert("Seja bem-vindo ao TechFood! Aproveite nossos cupons de hoje.");

// (Slide 18)
const cliente = prompt("Para um atendimento personalizado, digite seu nome:");

// (Slide 19)
let nomeFormatado = cliente.trim().toUpperCase();

// 3. FUNÇÕES DE DATA E HORA (Slide 20)
// Captura a hora do sistema do usuário para saudação
const agora = new Date();
const hora = agora.getHours();

if (hora < 12) {
    alert("Bom dia, " + nomeFormatado + "! O café da manhã já saiu.");
} else {
    alert("Olá, " + nomeFormatado + "! Que tal conferir nossas massas para o jantar?");
}

// 4. INSTANCIANDO OBJETOS E LOGICA ARITMÉTICA (Slide 21)
const lasanha = new Prato("Lasanha Bolonhesa", 45.00);

let qtd = prompt("Simulação: Quantas unidades de " + lasanha.nome + " você deseja?");
let total = lasanha.preco * qtd;

// Exibindo o cálculo final
alert("Resumo da Simulação:\nPrato: " + lasanha.nome + "\nTotal: " + lasanha.exibirComMoeda());