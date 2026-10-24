const respostas = ["B", "B", "C", "D"]; 
const gabarito = ["A", "B", "B", "D"]; 
let acertos = 0; 
for (let i = 0 ; i < respostas.length; i++) { 
 if (respostas[i] === gabarito[i]) { 
 acertos++; 
 } 
} 
console.log("Acertos: " + acertos); 
