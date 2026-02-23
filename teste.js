// Criando o objeto com a data/hora exata do agora
const tempoAgora = new Date();

// 1. Pegando a hora para saudação
const hora = tempoAgora.getHours();

// 2. Formatando data e hora para o recibo do cliente
const dataFormatada = tempoAgora.toLocaleDateString('pt-BR');
const horaFormatada = tempoAgora.toLocaleTimeString('pt-BR');

console.log("Pedido realizado em: " + dataFormatada);
console.log("Horário: " + horaFormatada);

if (hora >= 18 && hora <= 23) {
    alert("Estamos abertos! Boa janta.");
}
