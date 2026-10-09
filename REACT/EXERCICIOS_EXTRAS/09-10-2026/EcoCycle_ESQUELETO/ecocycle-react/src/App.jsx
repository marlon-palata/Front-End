// TODO T11: importe o useState de "react"
// TODO T3: importe o Header e o Rodape (pasta ./components)
// TODO T4: importe o CardMaterial
// TODO T7: importe a lista { materiais } de "./data/materiais"
import "./App.css";

// Lista pronta de materiais: você vai usar no T5.
// TODO T7: recorte esta lista daqui e cole em src/data/materiais.js
const materiais = [
  { id: 1, nome: "Papel", lixeira: "Azul", precoKg: 0.5, perigoso: false, dica: "Dobre as caixas e não deixe o papel molhar." },
  { id: 2, nome: "Plástico", lixeira: "Vermelha", precoKg: 1.2, perigoso: false, dica: "Lave as embalagens e amasse as garrafas." },
  { id: 3, nome: "Vidro", lixeira: "Verde", precoKg: 0.15, perigoso: false, dica: "Embrulhe vidro quebrado em jornal antes de descartar." },
  { id: 4, nome: "Alumínio", lixeira: "Amarela", precoKg: 5.0, perigoso: false, dica: "Amasse as latinhas para ocupar menos espaço." },
  { id: 5, nome: "Pilhas e baterias", lixeira: "Laranja", precoKg: 0, perigoso: true, dica: "Nunca jogue no lixo comum: leve a um ponto de coleta." },
];

function App() {
  // TODO T2: crie a constante cidade com o valor "Itu/SP"

  // TODO T11: crie os estados totalKg e totalValor (os dois começam em 0)
  // TODO T11: crie a função registrarColeta(kg, precoKg) que soma nos dois totais
  // TODO T12 (desafio): crie a função limparColeta que volta os dois totais para 0

  return (
    <main className="app">
      {/* T1: se esta frase aparece no navegador, o projeto está rodando */}
      {/* TODO T2: troque a frase abaixo por um <h1> EcoCycle e um <p className="subtitulo"> Coleta seletiva em {cidade} */}
      <p>Projeto rodando! Agora siga o guia.</p>

      {/* TODO T3: troque o <h1> por <Header /> */}
      {/* TODO T6: <p className="contador"> com o total de materiais (materiais.length) */}

      <section className="lista">
        {/* TODO T4: um <CardMaterial /> com nome, lixeira e precoKg do Papel */}
        {/* TODO T5: troque o card único por materiais.map(...) com key={material.id} */}
      </section>

      {/* TODO T3: coloque o <Rodape /> aqui */}
    </main>
  );
}

export default App;
