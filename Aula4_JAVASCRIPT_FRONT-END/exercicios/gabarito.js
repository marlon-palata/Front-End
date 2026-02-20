/* GABARITO 1 */
let n = prompt("Nome:").trim();
let s = prompt("Sobrenome:").trim();
let completo = n + " " + s;
alert(completo.toLowerCase());
alert("Seu nome tem " + completo.length + " caracteres.");

/* GABARITO 2 */
let total = prompt("Valor da conta:");
let pessoas = prompt("Qtd pessoas:");
let divisao = total / pessoas;
alert("Cada amigo deve pagar R$ " + divisao.toFixed(2));

/* GABARITO 3 */
let valor = prompt("Valor da compra:");
let cupom = prompt("Tem cupom? (sim/nao)");
if (valor > 150 || cupom == "sim") {
    console.log("Frete Grátis Liberado");
} else {
    console.log("Frete Pago");
}

/* GABARITO 4 */
let userNum = prompt("Escolha de 1 a 10:");
let sortudo = Math.floor(Math.random() * 10) + 1;
if (userNum == sortudo) {
    alert("Parabéns, você ganhou um brinde!");
} else {
    alert("Que pena, o número sorteado foi " + sortudo);
}

/* GABARITO 5 */
class Veiculo {
    constructor(mo, ma, an) {
        this.modelo = mo;
        this.marca = ma;
        this.ano = an;
    }
    idadeVeiculo(anoAtual) {
        return anoAtual - this.ano;
    }
}
const meuCarro = new Veiculo("Corolla", "Toyota", 2020);
let anoHj = prompt("Em que ano estamos?");
alert("O " + meuCarro.modelo + " tem " + meuCarro.idadeVeiculo(anoHj) + " anos.");